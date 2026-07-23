import { jwt } from '@elysia/jwt'
import { env } from '@server/config/env'
import { db } from '@server/db'
import { attendanceRecords, classSessions, courseEnrollments, courses, rooms, users } from '@server/db/schema'
import { publishAttendanceSuccess } from '@server/services/mqtt.service'
import { generateOTPForRoom, verifyOtp } from '@server/services/otp.service'
import { and, eq } from 'drizzle-orm'
import { Elysia, status, t } from 'elysia'

interface Student {
  id: string
  studentId: string
  email: string
  studentName: string
}

const studentAuthRoute = new Elysia()
  .use(
    jwt({
      name: 'studentJwt',
      secret: env.JWT_SECRET,
      schema: t.Object({
        id: t.String(),
        studentId: t.String(),
        studentName: t.String(),
        email: t.String(),
      }),
    }),
  )
  .post(
    '/login/student',
    async ({ body: { studentId, password }, studentJwt }) => {
      if (!studentId || !password) {
        return status(400, 'Đăng nhập thất bại')
      }

      const student = await db.query.users.findFirst({ where: { studentId, role: 'STUDENT' } })

      if (!student) {
        return status(404)
      }

      if (!(await Bun.password.verify(password, student.passwordHash).catch(() => false))) {
        return status(401, 'Sai mật khẩu hoặc lỗi xác thực')
      }

      const token = await studentJwt.sign({
        id: student.id,
        studentId: student.studentId,
        email: student.email,
        studentName: student.name,
      })

      return { token }
    },
    {
      body: t.Object({
        studentId: t.String(),
        password: t.String(),
      }),
    },
  )

export const studentRoute = new Elysia().use(studentAuthRoute).group('/student', (app) =>
  app
    .derive(async ({ headers: { authorization }, studentJwt }) => {
      if (!authorization?.startsWith('Bearer ')) {
        return status(401, 'Invalid or missing token')
      }

      const token = authorization.slice(7)

      try {
        const decodedToken = (await studentJwt.verify(token)) as Student
        if (!decodedToken) return status(401, 'Invalid or missing token')

        return { user: decodedToken }
      } catch {
        return status(401, 'Invalid or missing token')
      }
    })
    .post(
      '/check-in',
      async ({ body: { roomId, otp }, user }) => {
        // === Verify OTP ===
        try {
          const isOTPValid = await verifyOtp(roomId, otp)

          if (!isOTPValid) {
            return status(400, 'Invalid or expired OTP. Please retry again.')
          }
        } catch (error) {
          // VerifyOTP throw Error when room does not exist or OTP is invalid
          return status(400, error instanceof Error ? error.message : 'OTP verification failed')
        }

        // === Find active session ===
        const now = new Date()

        const room = await db.query.rooms.findFirst({
          columns: {},
          where: { id: roomId },
          with: {
            currentActiveSession: {
              columns: {
                id: true,
                courseId: true,
                sessionStartTime: true,
              },
            },
          },
        })

        if (!room) {
          return status(404, 'Room not found')
        }

        if (!room.currentActiveSession) {
          return status(404, 'There is no active session in this room right now')
        }

        const activeSession = room.currentActiveSession
        const sessionId = activeSession.id

        // Verify if the student is enrolled in this course
        const enrollment = await db.$count(
          courseEnrollments,
          and(eq(courseEnrollments.courseId, activeSession.courseId), eq(courseEnrollments.studentId, user.id)),
        )

        if (!enrollment) {
          return status(404, 'You are not enrolled in this class')
        }

        // === Check for duplicate check-ins within the same session ===
        const duplicateCheck = await db.$count(
          attendanceRecords,
          and(eq(attendanceRecords.studentId, user.id), eq(attendanceRecords.sessionId, sessionId)),
        )

        if (duplicateCheck) {
          return status(400, 'You have already checked in for this session.')
        }

        // === Save check-in record to Postgres ===
        await db.insert(attendanceRecords).values({
          studentId: user.id,
          sessionId: sessionId,
          checkInTimestamp: now,
        })

        // === Publish MQTT Success Message to ESP32 ===
        // Fire and forget MQTT publish
        await publishAttendanceSuccess(roomId, user.studentId, user.studentName, now)

        // Determine late status (15 minutes window)
        const lateThreshold = new Date(activeSession.sessionStartTime.getTime() + 15 * 60 * 1000)
        const isLate = now.getTime() > lateThreshold.getTime()

        // === Return result ===
        const lateWarning = isLate ? ' (Note: You are marked as late)' : ''
        return {
          message: `Check-in successful!${lateWarning}`,
        }
      },
      {
        // Schema validation using Elysia's built-in validator (based on TypeBox)
        body: t.Object({
          roomId: t.String({ format: 'uuid' }),
          otp: t.String({ minLength: 6, maxLength: 6 }),
        }),
      },
    )
    // GET /api/debug/otp/:roomId - Get current OTP for debugging
    .get('/debug/otp/:roomId', async ({ params }) => {
      const otp = await generateOTPForRoom(params.roomId)
      return { currentOTP: otp }
    })
    // GET /api/rooms - Public endpoint to list all rooms with active course info
    .get('/rooms', async () => {
      try {
        const allRooms = await db.select().from(rooms)
        const activeSessions = await db
          .select({
            sessionId: classSessions.id,
            roomId: classSessions.roomId,
            courseId: classSessions.courseId,
            sessionStartTime: classSessions.sessionStartTime,
            courseCode: courses.courseCode,
            courseName: courses.courseName,
            teacherName: users.name,
          })
          .from(classSessions)
          .innerJoin(courses, eq(classSessions.courseId, courses.id))
          .innerJoin(users, eq(courses.teacherId, users.id))
          .where(eq(classSessions.status, 'ACTIVE'))

        const roomStatus = allRooms.map((r) => {
          const activeSession = activeSessions.find((s) => s.roomId === r.id)
          return {
            ...r,
            isOccupied: !!activeSession,
            occupiedByCourseId: activeSession?.courseId,
            activeCourse: activeSession
              ? {
                  courseCode: activeSession.courseCode,
                  courseName: activeSession.courseName,
                  teacherName: activeSession.teacherName,
                  sessionStartTime: activeSession.sessionStartTime,
                }
              : null,
          }
        })
        return roomStatus
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred'
        return { error: message, data: [] }
      }
    })
    .get('/rooms/:id', async ({ params: { id } }) => {
      const room = await db.query.rooms.findFirst({
        where: { id },
        with: {
          currentActiveSession: {
            columns: {
              sessionStartTime: true,
            },
            with: {
              course: {
                columns: {
                  courseCode: true,
                  courseName: true,
                },
                with: {
                  teacher: {
                    columns: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      if (!room) {
        return status(404, 'Room not found')
      }

      return {
        id: room.id,
        name: room.name,
        building: room.building,
        isOccupied: !!room.currentActiveSession,
        activeSession: room.currentActiveSession
          ? {
              courseCode: room.currentActiveSession.course.courseCode,
              courseName: room.currentActiveSession.course.courseName,
              teacherName: room.currentActiveSession.course.teacher.name,
              sessionStartTime: room.currentActiveSession.sessionStartTime,
            }
          : null,
      }
    }),
)
