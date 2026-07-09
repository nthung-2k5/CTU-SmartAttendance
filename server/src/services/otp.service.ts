import { OTP } from 'otplib'
import {db} from '../config/firebase'
import {env} from '../config/env'
import type { RoomConfig } from '../types/checkin.types'
import { is } from 'drizzle-orm'

const authenticator = new OTP()

// Xác thực mã OTP cho một phòng học cụ thể
export async function verifyOtp(roomId: string, otp: string): Promise<boolean> {
  // Tra firestore lấy config phòng học
  const roomDoc = await db.collection('rooms').doc(roomId).get()
  if (!roomDoc.exists) {
    throw new Error(`Classroom "${roomId}" does not exist in the system`)
  }

  // Lấy secretKey từ document
  const roomData = roomDoc.data() as RoomConfig
  const { secretKey } = roomData

  // Dùng otplib kiểm tra OTP (API v13)
  const result = await authenticator.verify({
    token: otp,
    secret: secretKey,
    period: env.TOTP_STEP_SECONDS, // Thay thế cho 'step' cũ
    epochTolerance: env.TOTP_WINDOW, // Thay thế cho 'window' cũ
  })

  return result.valid
}

// Sinh mã OTP cho một phòng học
// Debug only
export async function generateOTPForRoom(roomId:string): Promise<string> {
  // Lấy config phòng học
  const roomDoc = await db.collection('rooms').doc(roomId).get()
  if (!roomDoc.exists) {
    throw new Error(`Classroom "${roomId}" does not exist in the system`)
  }

  // Lấy secretKey từ document
  const roomData = roomDoc.data() as RoomConfig
  
  // Gọi hàm generate (API v13)
  return await authenticator.generate({
    secret: roomData.secretKey,
    period: env.TOTP_STEP_SECONDS,
  })
}
