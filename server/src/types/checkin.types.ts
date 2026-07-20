// Data sent from the Mobile App during check-in
export interface CheckInRequest {
  // Student ID
  studentId: string
  // ID classroom
  // Format: "205-C1": "2xx-x" = 2nd floor; "x05-x" = room 05; "xxx-C1" = C1 building
  // Display format is "205/C1". Converted to "-" for Firebase compatibility
  // Must match the BLE payload from ESP32
  roomId: string
  // 6-digit OTP read by the App from the BLE Beacon
  otp: string
}

// Response sent to the Mobile App after check-in
export interface CheckInResponse {
  success: boolean
  message: string
}

// Document stored in Firestore "check_ins" collection
export interface CheckInRecord {
  studentId: string
  roomId: string
  // Session ID
  sessionId: string
  timestamp: FirebaseFirestore.Timestamp
  isLate: boolean
  // Extensible for future methods: 'ble-totp' | 'qr-code' | 'nfc' | ...
  method: 'ble-totp'
}

// Document stored in Firestore "rooms" collection
// Each room has a unique Secret Key for TOTP
export interface RoomConfig {
  // Display name, e.g., "Room 205/C1"
  name: string
  // Building name/code, e.g., "C1"
  building: string
  // Secret Key for TOTP algorithm (base32 encoded)
  secretKey: string
}

// Document stored in Firestore "sessions" collection
// A session represents a class instance, used for duplicate checking and late status
export interface SessionConfig {
  // Room ID where the session takes place, e.g., "205-C1"
  roomId: string
  // Course code, e.g., "CT240"
  courseCode: string
  // Course name, e.g., "Software Engineering"
  courseName: string
  // Teacher ID, e.g., "GV001"
  teacherId: string
  // Session start time
  startTime: FirebaseFirestore.Timestamp
  // Session end time
  endTime: FirebaseFirestore.Timestamp
  // Minutes after startTime to be considered late (e.g., 15 means 7:15 is late if start is 7:00)
  lateAfterMinutes: number

  enrolledStudents: Array<{
    studentId: string
    name: string
  }>
}
