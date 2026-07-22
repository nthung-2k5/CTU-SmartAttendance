import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { attendanceRecords, classSessions, courseEnrollments, users } from '../db/schema'
import type { CheckInRequest, CheckInResponse } from '../types/checkin.types'
import { publishAttendanceSuccess } from './mqtt.service'
import { verifyOtp } from './otp.service'

// Process the entire check-in flow for a student
export async function processCheckIn(request: CheckInRequest): Promise<CheckInResponse> {
  const { studentId, roomId, otp } = request

  // Find user by studentId string
  const userList = await db.select().from(users).where(eq(users.studentId, studentId)).limit(1)
  if (userList.length === 0) {
    return { success: false, message: 'Student not found in the system.' }
  }
  const user = userList[0]

  // === Verify OTP ===
  let isOTPValid: boolean
  try {
    isOTPValid = await verifyOtp(roomId, otp)
  } catch (error) {
    // VerifyOTP throw Error when room does not exist or OTP is invalid
    const message = error instanceof Error ? error.message : 'OTP verification failed'
    return { success: false, message }
  }
  if (!isOTPValid) {
    return {
      success: false,
      message: 'Invalid or expired OTP. Please scan the BLE beacon again.',
    }
  }

  // === Find active session ===
  const now = new Date()

  const sessionList = await db
    .select()
    .from(classSessions)
    .where(and(eq(classSessions.roomId, roomId), eq(classSessions.status, 'ACTIVE')))

  if (sessionList.length === 0) {
    return {
      success: false,
      message: 'There is no active session in this room right now',
    }
  }

  const activeSession = sessionList[0]
  const sessionId = activeSession.id
  const courseId = activeSession.courseId

  // Verify if the student is enrolled in this class
  const enrollmentList = await db
    .select()
    .from(courseEnrollments)
    .where(and(eq(courseEnrollments.courseId, courseId), eq(courseEnrollments.studentId, user.id)))
    .limit(1)

  if (enrollmentList.length === 0) {
    return {
      success: false,
      message: 'You are not enrolled in this class.',
    }
  }

  // === Check for duplicate check-ins within the same session ===
  const duplicateCheck = await db
    .select()
    .from(attendanceRecords)
    .where(and(eq(attendanceRecords.studentId, user.id), eq(attendanceRecords.sessionId, sessionId)))
    .limit(1)

  if (duplicateCheck.length > 0) {
    return {
      success: false,
      message: 'You have already checked in for this session.',
    }
  }

  // Determine late status (15 minutes window)
  const lateThreshold = new Date(activeSession.sessionStartTime.getTime() + 15 * 60 * 1000)
  const isLate = now.getTime() > lateThreshold.getTime()

  // === Save check-in record to Postgres ===
  await db.insert(attendanceRecords).values({
    studentId: user.id,
    sessionId: sessionId,
    checkInTimestamp: now,
  })

  // === Publish MQTT Success Message to ESP32 ===
  // Fire and forget MQTT publish
  publishAttendanceSuccess(roomId, user.studentId || '', user.name).catch(console.error)

  // === Return result ===
  const lateWarning = isLate ? ' (Note: You are marked as late)' : ''
  return {
    success: true,
    message: `Check-in successful!${lateWarning}`,
  }
}
