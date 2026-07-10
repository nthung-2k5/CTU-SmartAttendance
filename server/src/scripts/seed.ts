import { db } from '../config/firebase'
import { Timestamp } from 'firebase-admin/firestore'

async function seed() {
  console.log("Bắt đầu seed data vào Firestore...");

  // 1. Seed Room
  // await db.collection('rooms').doc('104-DI')
  // .set({
  //   name: "Phòng 104/DI",
  //   building: "DI",
  //   secretKey: "2MR7CMHUHLSVPRRKL3PDWHVXRQTPS54Q" // Base32 test key
  // });
  // console.log("Seeded Room: 104-DI");

  // await db.collection('rooms').doc('106-DI')
  // .set({
  //   name: "Phòng 106/DI",
  //   building: "DI",
  //   secretKey: "R45K3EKY2U7N5VSP5XKID4KN2KX5MDHL" // Base32 test key
  // });
  // console.log("Seeded Room: 106-DI");

  // 2. Seed Users
  // Sinh viên
  // await db.collection('users').doc('user_student_1').set({
  //   email: "vy@gmail.com",
  //   name: "Tiêu Bình Vỹ",
  //   role: "student",
  //   studentId: "B2303859"
  // });

  // await db.collection('users').doc('user_student_2').set({
  //   email: "hao@gmail.com",
  //   name: "Võ Nhựt Hào",
  //   role: "student",
  //   studentId: "B2303808"
  // });

  // await db.collection('users').doc('user_student_3').set({
  //   email: "hien@gmail.com",
  //   name: "Trần Thị Thuý Hiền",
  //   role: "student",
  //   studentId: "B2303813"
  // });

  // Giảng viên
  // await db.collection('users').doc('user_teacher_1').set({
  //   email: "viet.gv@gmail.com",
  //   name: "Trương Xuân Việt",
  //   role: "teacher",
  //   teacherId: "GV001"
  // });
  // console.log("Seeded Users (Students & Teacher)");

  // 3. Seed Session
  // Giả lập thời gian: bắt đầu 10 phút trước, kết thúc 1 tiếng rưỡi sau
  const now = new Date();
  const startTime = new Date(now.getTime() - 10 * 60000);
  const endTime = new Date(now.getTime() + 90 * 60000);

  const sessionRef = db.collection('sessions').doc('N0A1PqwWSh2fmty10h9d');
  await sessionRef.set({
    roomId: "104-DI",
    courseCode: "CT250E",
    courseName: "Niên luận ngành Kỹ thuật phần mềm",
    teacherId: "GV002",
    startTime: Timestamp.fromDate(startTime),
    endTime: Timestamp.fromDate(endTime),
    lateAfterMinutes: 15,
    enrolledStudents: [
      { studentId: "B2303819", name: "Nguyễn Trường Hưng" },
      { studentId: "B2303859", name: "Tiêu Bình Vỹ" }
    ]
  });

  console.log("Seed data completed!");
  process.exit(0);
}

seed().catch(console.error);
