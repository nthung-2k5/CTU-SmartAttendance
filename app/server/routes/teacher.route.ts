import { jwt } from '@elysia/jwt'
import { and, eq } from 'drizzle-orm'
import { Elysia, status, t } from 'elysia'
import { env } from '../config/env'
import { db } from '../db'
import { attendanceRecords, classSessions, courseEnrollments, rooms, users } from '../db/schema'

export const teacherRoute = new Elysia({ prefix: '/api/teacher' }).guard(
  {
    cookie: t.Cookie({
      auth: t.Optional(t.String()),
    }),
  },
  (app) =>
    app
      .use(
        jwt({
          name: 'jwt',
          secret: env.JWT_SECRET,
          schema: t.Object({
            id: t.String(),
            role: t.Union([t.Literal('STUDENT'), t.Literal('TEACHER'), t.Literal('ADMIN')]),
            name: t.String(),
            email: t.String(),
            teacherId: t.Optional(t.String()),
          }),
        }),
      )
      .resolve(async ({ cookie: { auth }, jwt }) => {
        const token = auth.value
        if (!token) {
          return { user: null }
        }
        try {
          const decodedToken = await jwt.verify(token)
          if (decodedToken?.role !== 'TEACHER') return { user: null }
          return { user: decodedToken }
        } catch {
          return { user: null }
        }
      })
      .onBeforeHandle(({ user }) => {
        if (!user) {
          return status(401)
        }
      })
      .get('/me', async ({ user }) => {
        const safeUser = await db.query.users.findFirst({
          columns: {
            passwordHash: false,
            studentId: false,
            deviceId: false,
          },
          where: {
            id: user.id,
          },
        })
        if (!safeUser) return status(401)

        return { user: safeUser }
      })
      .get('/courses', async ({ user }) => {
        return {
          data: await db.query.courses.findMany({
            where: {
              teacherId: user.id,
            },
          }),
        }
      })
      .get('/courses/:courseId', async ({ params: { courseId } }) => {
        const sessionsData = await db.query.courses.findFirst({
          where: {
            id: courseId,
          },
          with: {
            enrollments: {
              columns: {
                id: true,
                name: true,
                email: true,
                studentId: true,
              },
            },
            sessions: true,
          },
        })
        return { data: sessionsData }
      })
      .get('/sessions/:id/details', async ({ params: { id } }) => {
        // 1. Get session info
        const sessionList = await db.select().from(classSessions).where(eq(classSessions.id, id)).limit(1)
        if (sessionList.length === 0) return status(404)
        const session = sessionList[0]

        // 2. Get enrolled students
        const enrollments = await db
          .select({
            studentId: users.studentId,
            email: users.email,
            name: users.name,
            userId: users.id,
          })
          .from(courseEnrollments)
          .innerJoin(users, eq(courseEnrollments.studentId, users.id))
          .where(eq(courseEnrollments.courseId, session.courseId))

        // 3. Get check-ins
        const checks = await db
          .select({
            studentId: users.studentId,
            checkInTimestamp: attendanceRecords.checkInTimestamp,
          })
          .from(attendanceRecords)
          .innerJoin(users, eq(attendanceRecords.studentId, users.id))
          .where(eq(attendanceRecords.sessionId, session.id))

        return {
          data: {
            session,
            enrolledStudents: enrollments,
            checkIns: checks.map((c) => {
              const lateThreshold = new Date(session.sessionStartTime.getTime() + 15 * 60 * 1000)
              const isLate = new Date(c.checkInTimestamp).getTime() > lateThreshold.getTime()
              return {
                studentId: c.studentId,
                timestamp: c.checkInTimestamp,
                isLate,
              }
            }),
          },
        }
      })
      .get('/rooms', async () => {
        const allRooms = await db.select().from(rooms)
        const activeSessions = await db.select().from(classSessions).where(eq(classSessions.status, 'ACTIVE'))
        const roomStatus = allRooms.map((r) => {
          const activeSession = activeSessions.find((s) => s.roomId === r.id)
          return {
            ...r,
            isOccupied: !!activeSession,
            occupiedByCourseId: activeSession?.courseId,
          }
        })
        return { data: roomStatus }
      })
      .get('/courses/:courseId/active-session', async ({ params: { courseId } }) => {
        const activeSessionList = await db
          .select()
          .from(classSessions)
          .where(and(eq(classSessions.courseId, courseId), eq(classSessions.status, 'ACTIVE')))
          .limit(1)
        if (activeSessionList.length === 0) return { data: null }
        const session = activeSessionList[0]

        const enrollments = await db
          .select({ studentId: users.studentId, name: users.name, id: users.id, email: users.email })
          .from(courseEnrollments)
          .innerJoin(users, eq(courseEnrollments.studentId, users.id))
          .where(eq(courseEnrollments.courseId, session.courseId))
        const checks = await db
          .select({ studentId: users.studentId, checkInTimestamp: attendanceRecords.checkInTimestamp })
          .from(attendanceRecords)
          .innerJoin(users, eq(attendanceRecords.studentId, users.id))
          .where(eq(attendanceRecords.sessionId, session.id))

        return {
          data: {
            session,
            enrolledStudents: enrollments,
            checkIns: checks.map((c) => {
              const lateThreshold = new Date(session.sessionStartTime.getTime() + 15 * 60 * 1000)
              const isLate = new Date(c.checkInTimestamp).getTime() > lateThreshold.getTime()
              return {
                studentId: c.studentId,
                timestamp: c.checkInTimestamp,
                isLate,
              }
            }),
          },
        }
      })
      .post(
        '/courses/:courseId/sessions/start',
        async ({ params: { courseId }, body }) => {
          const { roomId } = body

          // Check if room is occupied
          const activeSessions = await db.$count(
            classSessions,
            and(eq(classSessions.roomId, roomId), eq(classSessions.status, 'ACTIVE')),
          )
          if (activeSessions > 0) return status(400) // Room occupied

          // Check if course already has an active session
          const courseActiveSession = await db.$count(
            classSessions,
            and(eq(classSessions.courseId, courseId), eq(classSessions.status, 'ACTIVE')),
          )
          if (courseActiveSession > 0) return status(400) // Course already has active session

          const newSess = await db
            .insert(classSessions)
            .values({ courseId, roomId, sessionStartTime: new Date(), status: 'ACTIVE' })
            .returning()

          return { data: newSess[0] }
        },
        {
          body: t.Object({
            roomId: t.String(),
          }),
        },
      )
      .post('/sessions/:id/end', async ({ params: { id } }) => {
        await db
          .update(classSessions)
          .set({ status: 'COMPLETED', sessionEndTime: new Date() })
          .where(eq(classSessions.id, id))
        return { success: true }
      })
      .post(
        '/sessions/:id/attendance',
        async ({ params: { id }, body }) => {
          const { studentId, present } = body

          const studentUser = await db.query.users.findFirst({
            where: {
              studentId,
            },
          })
          if (!studentUser) return status(404)

          if (present) {
            const existing = await db.query.attendanceRecords.findFirst({
              where: {
                sessionId: id,
                studentId: studentUser.id,
              },
            })
            if (!existing) {
              await db
                .insert(attendanceRecords)
                .values({ sessionId: id, studentId: studentUser.id, checkInTimestamp: new Date() })
            }
          } else {
            await db
              .delete(attendanceRecords)
              .where(and(eq(attendanceRecords.sessionId, id), eq(attendanceRecords.studentId, studentUser.id)))
          }

          return { success: true }
        },
        {
          body: t.Object({
            studentId: t.String(),
            present: t.Boolean(),
          }),
        },
      ),
)
