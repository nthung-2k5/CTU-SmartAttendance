import { OTP } from 'otplib'
import { env } from '../config/env'
import { db } from '../config/firebase'
import type { RoomConfig } from '../types/checkin.types'
import { getNtpTime } from './ntp.service'

const authenticator = new OTP()

// Verify OTP for a specific room
export async function verifyOtp(roomId: string, otp: string): Promise<boolean> {
  // Query Firestore for room configuration
  const roomDoc = await db.collection('rooms').doc(roomId).get()
  if (!roomDoc.exists) {
    throw new Error(`Classroom "${roomId}" does not exist in the system`)
  }

  // Extract secretKey from document
  const roomData = roomDoc.data() as RoomConfig
  const { secretKey } = roomData

  // Verify OTP using otplib (API v13)
  const result = await authenticator.verify({
    token: otp,
    secret: secretKey,
    period: env.TOTP_STEP_SECONDS,
    epochTolerance: env.TOTP_WINDOW,
    epoch: getNtpTime(),
  })

  return result.valid
}

// Generate OTP for a room
// Debug only
export async function generateOTPForRoom(roomId: string): Promise<string> {
  // Query Firestore for room configuration
  const roomDoc = await db.collection('rooms').doc(roomId).get()
  if (!roomDoc.exists) {
    throw new Error(`Classroom "${roomId}" does not exist in the system`)
  }

  // Extract secretKey from document
  const roomData = roomDoc.data() as RoomConfig

  // Call generate function (API v13)
  return await authenticator.generate({
    secret: roomData.secretKey,
    period: env.TOTP_STEP_SECONDS,
    epoch: getNtpTime(),
  })
}
