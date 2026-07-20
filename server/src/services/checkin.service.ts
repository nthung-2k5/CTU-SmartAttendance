import { Timestamp } from 'firebase-admin/firestore'
import { db } from '../config/firebase'
import type { CheckInRecord, CheckInRequest, CheckInResponse, SessionConfig } from '../types/checkin.types'
import { publishAttendanceSuccess } from './mqtt.service'
import { verifyOtp } from './otp.service'

// Process the entire check-in flow for a student
export async function processCheckIn(request: CheckInRequest): Promise<CheckInResponse> {
  const { studentId, roomId, otp } = request

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
  const now = Timestamp.now()

  const sessionQuery = await db.collection('sessions').where('roomId', '==', roomId).where('startTime', '<=', now).get()

  // Filter results to find an active session
  const activeSession = sessionQuery.docs.find((doc) => {
    const session = doc.data() as SessionConfig
    return session.endTime.toMillis() >= now.toMillis()
  })

  if (!activeSession) {
    return {
      success: false,
      message: 'There is no active session in this room right now',
    }
  }

  const sessionId = activeSession.id
  const sessionData = activeSession.data() as SessionConfig

  // Verify if the student is enrolled in this class
  const isEnrolled = sessionData.enrolledStudents.some((student) => student.studentId === studentId)
  if (!isEnrolled) {
    return {
      success: false,
      message: 'You are not enrolled in this class.',
    }
  }

  // === Check for duplicate check-ins within the same session ===
  // Rule: Same student + same session = already checked in
  const duplicateCheck = await db
    .collection('check_ins')
    .where('studentId', '==', studentId)
    .where('sessionId', '==', sessionId)
    .limit(1)
    .get()

  if (!duplicateCheck.empty) {
    return {
      success: false,
      message: 'You have already checked in for this session.',
    }
  }

  // Determine late status
  // Rule: isLate = true if current time > startTime + lateAfterMinutes
  const lateThreshold = Timestamp.fromMillis(
    sessionData.startTime.toMillis() + sessionData.lateAfterMinutes * 60 * 1000,
  )
  const isLate = now.toMillis() > lateThreshold.toMillis()

  // === Save check-in record to Firestore ===
  const record: CheckInRecord = {
    studentId,
    roomId,
    sessionId,
    timestamp: now,
    isLate,
    method: 'ble-totp',
  }

  await db.collection('check_ins').add(record)

  // === Publish MQTT Success Message to ESP32 ===
  const student = sessionData.enrolledStudents.find((s) => s.studentId === studentId)
  const studentName = student ? student.name : 'Unknown'

  // Fire and forget MQTT publish
  publishAttendanceSuccess(roomId, studentId, studentName).catch(console.error)

  // === Return result ===
  const lateWarning = isLate ? ' (Note: You are marked as late)' : ''
  return {
    success: true,
    message: `Check-in successful!${lateWarning}`,
  }
}
