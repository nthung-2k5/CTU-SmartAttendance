import { jwt } from '@elysia/jwt'
import { eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { env } from '../config/env'
import { db } from '../db'
import { classSessions, courses, rooms, users } from '../db/schema'
import { processCheckIn } from '../services/checkin.service'
import { generateOTPForRoom } from '../services/otp.service'

export const checkinRoute = new Elysia({ prefix: '/api' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
    }),
  )
  .derive(async ({ headers: { authorization }, jwt }) => {
    if (!authorization?.startsWith('Bearer ')) {
      return { user: null }
    }
    const token = authorization.slice(7)
    try {
      const decodedToken = await jwt.verify(token)
      if (!decodedToken) return { user: null }
      return { user: decodedToken }
    } catch {
      return { user: null }
    }
  })
  .post(
    '/check-in',
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401
        return { success: false, message: 'Unauthorized: Invalid or missing token' }
      }

      const result = await processCheckIn(body)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      // Schema validation using Elysia's built-in validator (based on TypeBox)
      body: t.Object({
        studentId: t.String({ minLength: 1 }),
        roomId: t.String({ minLength: 1 }),
        otp: t.String({ minLength: 6, maxLength: 6 }),
      }),
    },
  )

  // GET /api/debug/otp/:roomId - Get current OTP for debugging
  .get('/debug/otp/:roomId', async ({ params }) => {
    try {
      const otp = await generateOTPForRoom(params.roomId)
      return { roomId: params.roomId, currentOTP: otp }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return { error: message }
    }
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
      return { data: roomStatus }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return { error: message, data: [] }
    }
  })


