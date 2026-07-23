import { fromTypes, openapi } from '@elysia/openapi'
import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { env } from './config/env'
import { studentRoute } from './routes/student.route'
import { teacherRoute } from './routes/teacher.route'
import { setupNtpSync } from './services/ntp.service'

// Initialize NTP sync
setupNtpSync()

const app = new Elysia({ prefix: '/api' })
  .use(cors())
  .use(
    openapi({
      references: fromTypes(),
    }),
  )
  .onError(({ error }) => {
    console.error(error)
    return 'Internal Server Error'
  })
  .use(studentRoute)
  .use(teacherRoute)
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .listen({
    port: env.PORT,
    hostname: env.HOST,
  })

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
