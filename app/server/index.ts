import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { env } from './config/env'
import { authRoute } from './routes/auth.route'
import { checkinRoute } from './routes/checkin.route'
import { teacherRoute } from './routes/teacher.route'
import { setupNtpSync } from './services/ntp.service'

// Initialize NTP sync
setupNtpSync()

const app = new Elysia()
  .use(cors())
  .onError(({ error }) => {
    console.error(error)
    return 'Internal Server Error'
  })
  .use(checkinRoute)
  .use(authRoute)
  .use(teacherRoute)
  .get('/api/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .listen({
    port: env.PORT,
    hostname: env.HOST,
  })

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
