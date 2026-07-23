import { jwt } from '@elysia/jwt'
import { Elysia, status, t } from 'elysia'
import { env } from '../config/env'
import { db } from '../db'

export const authRoute = new Elysia({ prefix: '/api' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
    }),
  )
  .post(
    '/login/student',
    async ({ body, jwt }) => {
      const { studentId, password } = body

      if (!studentId || !password) {
        return status(400, 'Invalid credentials')
      }

      const user = await db.query.users.findFirst({ where: { studentId, role: 'STUDENT' } })

      if (!user) {
        return status(404)
      }

      // Using simple plain text comparison as default, use Bun.password for real apps if hashed
      const isMatch =
        password === user.passwordHash || (await Bun.password.verify(password, user.passwordHash).catch(() => false))

      if (!isMatch) {
        return status(401, 'Sai mật khẩu hoặc lỗi xác thực')
      }

      const token = await jwt.sign({ id: user.id, studentId: user.studentId, email: user.email, role: user.role })

      return {
        success: true,
        token,
        studentName: user.name,
      }
    },
    {
      body: t.Object({
        studentId: t.String(),
        password: t.String(),
      }),
    },
  )
  .post(
    '/login/teacher',
    async ({ body, jwt, cookie: { auth } }) => {
      const { teacherId, password } = body

      if (!teacherId || !password) {
        return status(400)
      }

      // We will query by teacherId. If it's email, we can adjust the query. Assuming teacherId string input.
      const user = await db.query.users.findFirst({ where: { teacherId, role: 'TEACHER' } })

      if (!user) {
        return status(404)
      }

      // Using simple plain text comparison as default, use Bun.password for real apps if hashed
      const isMatch =
        password === user.passwordHash || (await Bun.password.verify(password, user.passwordHash).catch(() => false))

      if (!isMatch) {
        return status(401, 'Sai mật khẩu hoặc lỗi xác thực')
      }

      const token = await jwt.sign({
        id: user.id,
        teacherId: user.teacherId,
        name: user.name,
        email: user.email,
        role: user.role,
      })

      auth.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 86400, // 7 days
        sameSite: 'lax',
      })

      return {
        success: true,
        token,
      }
    },
    {
      body: t.Object({
        teacherId: t.String(),
        password: t.String(),
      }),
      cookie: t.Cookie({
        auth: t.Optional(t.String()),
      }),
    },
  )
  .post('/logout/teacher', ({ cookie: { auth } }) => {
    auth.remove()
    return { success: true, message: 'Logged out successfully' }
  })
