import { Elysia, t } from 'elysia'
import { processCheckIn } from '../services/checkin.service'
import { generateOTPForRoom } from '../services/otp.service'
export const checkinRoute = new Elysia({ prefix: '/api' })
  // Check-in endpoint
  .post(
    '/check-in',
    async ({ body, set }) => {
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
