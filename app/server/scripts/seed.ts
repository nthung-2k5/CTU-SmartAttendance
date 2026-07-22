import { db } from '../db'
import { classSessions, courseEnrollments, courses, rooms, users } from '../db/schema'

async function seed() {
  console.log('Bắt đầu seed data vào Postgres...')

  const defaultPassword = await Bun.password.hash('123456')

  // 1. Seed Users
  console.log('Seeding users...')
  const [student1, student2, student3, teacher] = await db
    .insert(users)
    .values([
      {
        role: 'STUDENT',
        name: 'Nguyễn Trường Hưng',
        email: 'hungb2303819@student.ctu.edu.vn',
        studentId: 'B2303819',
        passwordHash: defaultPassword,
      },
      {
        role: 'STUDENT',
        name: 'Tiêu Bình Vỹ',
        email: 'vyb2303859@student.ctu.edu.vn',
        studentId: 'B2303859',
        passwordHash: defaultPassword,
      },
      {
        role: 'STUDENT',
        name: 'Võ Nhựt Hào',
        email: 'haob2303808@student.ctu.edu.vn',
        studentId: 'B2303808',
        passwordHash: defaultPassword,
      },
      {
        role: 'STUDENT',
        name: 'Trần Thị Thuý Hiền',
        email: 'hienb2303813@student.ctu.edu.vn',
        studentId: 'B2303813',
        passwordHash: defaultPassword,
      },
      {
        role: 'TEACHER',
        name: 'Trương Xuân Việt',
        email: 'txviet@ctu.edu.vn',
        teacherId: 'GV001',
        passwordHash: defaultPassword,
      },
    ])
    .returning()

  // 2. Seed Rooms
  console.log('Seeding rooms...')
  await db.insert(rooms).values([
    {
      id: '104-DI',
      name: 'Phòng 104/DI',
      building: 'DI',
      esp32MacAddress: '00:11:22:33:44:01',
      totpSecretKey: '2MR7CMHUHLSVPRRKL3PDWHVXRQTPS54Q',
    },
    {
      id: '106-DI',
      name: 'Phòng 106/DI',
      building: 'DI',
      esp32MacAddress: '00:11:22:33:44:02',
      totpSecretKey: 'R45K3EKY2U7N5VSP5XKID4KN2KX5MDHL',
    },
  ])

  // 3. Seed Course
  console.log('Seeding courses...')
  const [course] = await db
    .insert(courses)
    .values({
      teacherId: teacher.id,
      courseCode: 'CT250E',
      courseName: 'Niên luận ngành Kỹ thuật phần mềm',
    })
    .returning()

  // 4. Seed Course Enrollments
  console.log('Seeding enrollments...')
  await db.insert(courseEnrollments).values([
    { studentId: student1.id, courseId: course.id },
    { studentId: student2.id, courseId: course.id },
    { studentId: student3.id, courseId: course.id },
  ])

  // 5. Seed Session
  console.log('Seeding session...')
  const now = new Date()
  const startTime = new Date(now.getTime() - 10 * 60000)
  const endTime = new Date(now.getTime() + 90 * 60000)

  await db.insert(classSessions).values({
    roomId: '104-DI',
    courseId: course.id,
    sessionStartTime: startTime,
    sessionEndTime: endTime,
    status: 'ACTIVE',
  })

  console.log('Seed data completed!')
  process.exit(0)
}

seed().catch(console.error)
