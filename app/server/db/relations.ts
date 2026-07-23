import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (r) => ({
  // 1. A User has many Courses (as a teacher)
  users: {
    enrolledCourses: r.many.courses({
      from: r.users.id.through(r.courseEnrollments.studentId),
      to: r.courses.id.through(r.courseEnrollments.courseId),
    }),
    attendanceRecords: r.many.attendanceRecords({
      from: r.users.id,
      to: r.attendanceRecords.studentId,
    }),
  },

  courses: {
    enrollments: r.many.users({
      from: r.courses.id.through(r.courseEnrollments.courseId),
      to: r.users.id.through(r.courseEnrollments.studentId),
      where: {
        studentId: { isNotNull: true },
      },
    }),
    // 2. A Course belongs to one Teacher
    teacher: r.one.users({
      from: r.courses.teacherId,
      to: r.users.id,
      where: {
        teacherId: { isNotNull: true },
      },
      optional: false,
    }),
    sessions: r.many.classSessions({
      from: r.courses.id,
      to: r.classSessions.courseId,
    }),
  },

  // 4. A Course has many Class Sessions
  sessions: {
    course: r.one.courses({
      from: r.classSessions.courseId,
      to: r.courses.id,
    }),
    attendanceRecords: r.many.attendanceRecords({
      from: r.classSessions.id,
      to: r.attendanceRecords.sessionId,
    }),
    room: r.one.rooms({
      from: r.classSessions.roomId,
      to: r.rooms.id,
    }),
  },
}))
