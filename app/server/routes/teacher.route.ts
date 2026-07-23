import { jwt } from '@elysia/jwt'
import { env } from '@server/config/env'
import { db } from '@server/db'
import { attendanceRecords, classSessions } from '@server/db/schema'
import { publishSessionEnd, publishSessionStart } from '@server/services/mqtt.service'
import { and, eq } from 'drizzle-orm'
import { Elysia, status, t } from 'elysia'

interface Teacher {
  id: string
  teacherId: string
  name: string
  email: string
}

export const teacherAuthRoute = new Elysia()
  .use(
    jwt({
      name: 'teacherJwt',
      secret: env.JWT_SECRET,
      schema: t.Object({
        id: t.String(),
        teacherId: t.String(),
        name: t.String(),
        email: t.String(),
      }),
    }),
  )
  .post(
    '/login/teacher',
    async ({ body: { teacherId, password }, teacherJwt, cookie: { auth } }) => {
      if (!teacherId || !password) {
        return status(400, 'Đăng nhập thất bại')
      }

      // We will query by teacherId. If it's email, we can adjust the query. Assuming teacherId string input.
      const teacher = await db.query.users.findFirst({ where: { teacherId, role: 'TEACHER' } })

      if (!teacher) {
        return status(404)
      }

      if (!(await Bun.password.verify(password, teacher.passwordHash).catch(() => false))) {
        return status(401, 'Sai mật khẩu hoặc lỗi xác thực')
      }

      const token = await teacherJwt.sign({
        id: teacher.id,
        teacherId: teacher.teacherId,
        name: teacher.name,
        email: teacher.email,
      })

      auth.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 86400, // 7 days
        sameSite: 'lax',
      })

      return { token }
    },
    {
      body: t.Object({
        teacherId: t.String(),
        password: t.String(),
      }),
      cookie: t.Cookie({
        auth: t.Optional(t.String()),
      }),
    },
  )
  .post('/logout/teacher', ({ cookie: { auth } }) => {
    auth.remove()
    return status(204)
  })

export const teacherRoute = new Elysia().use(teacherAuthRoute).guard(
  {
    cookie: t.Cookie({
      auth: t.Optional(t.String()),
    }),
  },
  (app) =>
    app.group('/teacher', (app) =>
      app
        .resolve(async ({ cookie: { auth }, teacherJwt }) => {
          const token = auth.value
          if (!token) {
            return status(401)
          }
          try {
            const decodedToken = (await teacherJwt.verify(token)) as Teacher
            return { user: decodedToken }
          } catch {
            return status(401)
          }
        })
        .get('/me', async ({ user }) => {
          return user
        })
        .get('/courses', async ({ user }) => {
          const courses = await db.query.courses.findMany({
            columns: {
              teacherId: false,
            },
            where: {
              teacherId: user.id,
            },
          })

          return { courses }
        })
        .get('/courses/:id', async ({ params: { id } }) => {
          const course = await db.query.courses.findFirst({
            columns: {
              teacherId: false,
            },
            where: { id },
            with: {
              enrollments: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                  studentId: true,
                },
              },
              sessions: {
                columns: {
                  roomId: false,
                  courseId: false,
                },
                with: {
                  room: {
                    columns: {
                      id: true,
                      name: true,
                      building: true,
                    },
                  },
                },
              },
            },
          })

          return course ?? null
        })
        .get('/sessions/:id', async ({ params: { id } }) => {
          // 1. Get session info
          const session = await db.query.classSessions.findFirst({
            where: { id },
            orderBy: {
              sessionStartTime: 'desc'
            },
            with: {
              attendanceRecords: true,
              course: {
                columns: {},
                with: {
                  enrollments: {
                    columns: {
                      id: true,
                      studentId: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          })
          if (!session) return status(404, 'Session not found')

          return {
            id: session.id,
            status: session.status,
            sessionStartTime: session.sessionStartTime,
            sessionEndTime: session.sessionEndTime,
            enrolledStudents: session.course.enrollments,
            checkIns: session.attendanceRecords.map((c) => {
              const lateThreshold = new Date(session.sessionStartTime.getTime() + 15 * 60 * 1000)
              const isLate = new Date(c.checkInTimestamp).getTime() > lateThreshold.getTime()
              return {
                studentId: c.studentId,
                timestamp: c.checkInTimestamp,
                isLate,
              }
            }),
          }
        })
        .get('/rooms', async () => {
          const allRooms = await db.query.rooms.findMany({
            with: {
              currentActiveSession: {
                columns: {
                  id: true,
                },
              },
            },
          })

          const rooms = allRooms.map((r) => {
            return {
              id: r.id,
              name: r.name,
              building: r.building,
              isOccupied: !!r.currentActiveSession,
            }
          })

          return { rooms }
        })
        .get('/courses/:id/active-session', async ({ params: { id } }) => {
          const activeSession = await db.query.classSessions.findFirst({
            where: { courseId: id, status: 'ACTIVE' },
            with: {
              attendanceRecords: true,
              course: {
                columns: {},
                with: {
                  enrollments: {
                    columns: {
                      id: true,
                      studentId: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          })

          if (!activeSession) return null

          return {
            id: activeSession.id,
            status: activeSession.status,
            sessionStartTime: activeSession.sessionStartTime,
            sessionEndTime: activeSession.sessionEndTime,
            enrolledStudents: activeSession.course.enrollments,
            checkIns: activeSession.attendanceRecords.map((c) => {
              const lateThreshold = new Date(activeSession.sessionStartTime.getTime() + 15 * 60 * 1000)
              const isLate = new Date(c.checkInTimestamp).getTime() > lateThreshold.getTime()
              return {
                studentId: c.studentId,
                timestamp: c.checkInTimestamp,
                isLate,
              }
            }),
          }
        })
        .post(
          '/courses/:id/sessions/start',
          async ({ params: { id }, body }) => {
            const { roomId } = body

            // Check if room is occupied
            const activeSessions = await db.$count(
              classSessions,
              and(eq(classSessions.roomId, roomId), eq(classSessions.status, 'ACTIVE')),
            )
            if (activeSessions > 0) return status(400, 'Room occupied')

            // Check if course already has an active session
            const courseActiveSession = await db.$count(
              classSessions,
              and(eq(classSessions.courseId, id), eq(classSessions.status, 'ACTIVE')),
            )
            if (courseActiveSession > 0) return status(400, 'Course already has active session')

            const newSession = await db
              .insert(classSessions)
              .values({ courseId: id, roomId, sessionStartTime: new Date(), status: 'ACTIVE' })
              .returning()

            if (newSession[0]) await publishSessionStart(newSession[0].roomId, newSession[0].sessionStartTime)

            return newSession[0]
          },
          {
            body: t.Object({
              roomId: t.String(),
            }),
          },
        )
        .post('/sessions/:id/end', async ({ params: { id } }) => {
          const session = await db
            .update(classSessions)
            .set({ status: 'COMPLETED', sessionEndTime: new Date() })
            .where(eq(classSessions.id, id))
            .returning()

          if (session[0]) await publishSessionEnd(session[0].roomId)

          return status(204)
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
    ),
)
