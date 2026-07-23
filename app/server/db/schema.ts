import { sql } from 'drizzle-orm'
import { pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['STUDENT', 'TEACHER', 'ADMIN'])
export const statusEnum = pgEnum('status', ['ACTIVE', 'COMPLETED'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`uuidv7()`),
  role: roleEnum('role').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  studentId: text('student_id').unique(),
  teacherId: text('teacher_id').unique(),
  deviceId: text('device_id'),
})

export const rooms = pgTable('rooms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  building: text('building').notNull(),
  esp32MacAddress: text('esp32_mac_address').unique().notNull(),
  totpSecretKey: text('totp_secret_key').notNull(),
})

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().default(sql`uuidv7()`),
  teacherId: uuid('teacher_id')
    .notNull()
    .references(() => users.id),
  courseCode: text('course_code').notNull(),
  courseName: text('course_name').notNull(),
})

export const courseEnrollments = pgTable(
  'course_enrollments',
  {
    studentId: uuid('student_id')
      .notNull()
      .references(() => users.id),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id),
  },
  (table) => [primaryKey({ columns: [table.studentId, table.courseId] })],
)

export const classSessions = pgTable('class_sessions', {
  id: uuid('id').primaryKey().default(sql`uuidv7()`),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
  roomId: text('room_id')
    .notNull()
    .references(() => rooms.id),
  sessionStartTime: timestamp('session_start_time', { mode: 'date' }).notNull(),
  sessionEndTime: timestamp('session_end_time', { mode: 'date' }),
  status: statusEnum('status').notNull(),
})

export const attendanceRecords = pgTable('attendance_records', {
  id: uuid('id').primaryKey().default(sql`uuidv7()`),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => classSessions.id),
  studentId: uuid('student_id')
    .notNull()
    .references(() => users.id),
  checkInTimestamp: timestamp('check_in_timestamp', { mode: 'date' }).notNull(),
})
