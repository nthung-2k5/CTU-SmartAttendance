import { jwt } from '@elysia/jwt'
import { and, desc, eq } from 'drizzle-orm'
import { Elysia, status, t } from 'elysia'
import { env } from '../config/env'
import { db } from '../db'
import { attendanceRecords, classSessions, courseEnrollments, courses, rooms, users } from '../db/schema'

export const teacherRoute = new Elysia({ prefix: '/api/teacher' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
    }),
  )
  .guard(
    {
      cookie: t.Cookie({
        auth: t.Optional(t.String())
      })
    },
    (app) =>
      app
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
          const userList = await db
            .select()
            .from(users)
            .where(eq(users.id, user.id as string))
            .limit(1)
          if (userList.length === 0) return status(401)

          const { passwordHash, ...safeUser } = userList[0]
          return { user: safeUser }
        })
        .get('/courses', async ({ user }) => {
          const teacherCourses = await db
            .select()
            .from(courses)
            .where(eq(courses.teacherId, user.id as string))
          return { data: teacherCourses }
        })
        .get('/sessions', async ({ user }) => {
          // Find all courses taught by this teacher
          const teacherCourses = await db
            .select()
            .from(courses)
            .where(eq(courses.teacherId, user.id as string))
          const courseIds = teacherCourses.map((c) => c.id)

          if (courseIds.length === 0) return { data: [] }

          // Get sessions for these courses
          const sessionsData = await Promise.all(
            courseIds.map(async (courseId) => {
              return await db
                .select({
                  id: classSessions.id,
                  roomId: classSessions.roomId,
                  sessionStartTime: classSessions.sessionStartTime,
                  sessionEndTime: classSessions.sessionEndTime,
                  status: classSessions.status,
                  courseCode: courses.courseCode,
                  courseName: courses.courseName,
                })
                .from(classSessions)
                .innerJoin(courses, eq(classSessions.courseId, courses.id))
                .where(eq(classSessions.courseId, courseId))
                .orderBy(desc(classSessions.sessionStartTime))
            }),
          )

          return { data: sessionsData.flat() }
        })
        .get('/courses/:courseId/sessions', async ({ params: { courseId } }) => {
          const sessionsData = await db
            .select({
              id: classSessions.id,
              roomId: classSessions.roomId,
              sessionStartTime: classSessions.sessionStartTime,
              sessionEndTime: classSessions.sessionEndTime,
              status: classSessions.status,
              courseCode: courses.courseCode,
              courseName: courses.courseName,
            })
            .from(classSessions)
            .innerJoin(courses, eq(classSessions.courseId, courses.id))
            .where(eq(classSessions.courseId, courseId))
            .orderBy(desc(classSessions.sessionStartTime))
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
        }),
  )
