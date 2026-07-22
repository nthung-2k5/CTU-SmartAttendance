import { eq } from 'drizzle-orm'
import { OTP } from 'otplib'
import { env } from '../config/env'
import { db } from '../db'
import { rooms } from '../db/schema'
import { getNtpTime } from './ntp.service'

const authenticator = new OTP()

// Verify OTP for a specific room
export async function verifyOtp(roomId: string, otp: string): Promise<boolean> {
  const roomList = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1)
  if (roomList.length === 0) {
    throw new Error(`Classroom "${roomId}" does not exist in the system`)
  }

  const roomData = roomList[0]
  const { totpSecretKey } = roomData

  // Verify OTP using otplib (API v13)
  const result = await authenticator.verify({
    token: otp,
    secret: totpSecretKey,
    period: env.TOTP_STEP_SECONDS,
    epochTolerance: env.TOTP_WINDOW,
    epoch: getNtpTime(),
  })

  return result.valid
}

// Generate OTP for a room
// Debug only
export async function generateOTPForRoom(roomId: string): Promise<string> {
  const roomList = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1)
  if (roomList.length === 0) {
    throw new Error(`Classroom "${roomId}" does not exist in the system`)
  }

  const roomData = roomList[0]

  // Call generate function (API v13)
  return await authenticator.generate({
    secret: roomData.totpSecretKey,
    period: env.TOTP_STEP_SECONDS,
    epoch: getNtpTime(),
  })
}
