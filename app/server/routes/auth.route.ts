import { jwt } from '@elysia/jwt'
import { eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { env } from '../config/env'
import { db } from '../db'
import { users } from '../db/schema'

export const authRoute = new Elysia({ prefix: '/api' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
    }),
  )
  .post(
    '/login/student',
    async ({ body, set, jwt }) => {
      const { studentId, password } = body

      if (!studentId || !password) {
        set.status = 400
        return { success: false, message: 'Invalid credentials' }
      }

      try {
        const userList = await db.select().from(users).where(eq(users.studentId, studentId)).limit(1)

        if (userList.length === 0 || userList[0].role !== 'STUDENT') {
          set.status = 404
          return { success: false, message: 'Không tìm thấy tài khoản sinh viên (Student not found)' }
        }

        const user = userList[0]

        // Using simple plain text comparison as default, use Bun.password for real apps if hashed
        const isMatch =
          password === user.passwordHash || (await Bun.password.verify(password, user.passwordHash).catch(() => false))

        if (!isMatch) {
          set.status = 401
          return { success: false, message: 'Sai mật khẩu hoặc lỗi xác thực' }
        }

        const token = await jwt.sign({ id: user.id, studentId: user.studentId, email: user.email, role: user.role })

        return {
          success: true,
          token,
        }
      } catch (error) {
        console.error('Student login error:', error)
        set.status = 500
        return { success: false, message: 'Lỗi máy chủ nội bộ' }
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
    async ({ body, set, jwt, cookie: { auth } }) => {
      const { teacherId, password } = body

      if (!teacherId || !password) {
        set.status = 400
        return { success: false, message: 'Invalid credentials' }
      }

      try {
        // We will query by teacherId. If it's email, we can adjust the query. Assuming teacherId string input.
        const user = await db.query.users.findFirst({ where: { teacherId, role: 'TEACHER' } })

        if (!user) {
          set.status = 404
          return { success: false, message: 'Không tìm thấy tài khoản giảng viên (Teacher not found)' }
        }

        // Using simple plain text comparison as default, use Bun.password for real apps if hashed
        const isMatch =
          password === user.passwordHash || (await Bun.password.verify(password, user.passwordHash).catch(() => false))

        if (!isMatch) {
          set.status = 401
          return { success: false, message: 'Sai mật khẩu hoặc lỗi xác thực' }
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
      } catch (error) {
        console.error('Teacher login error:', error)
        set.status = 500
        return { success: false, message: 'Lỗi máy chủ nội bộ' }
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
