// Data gửi lên từ Mobile App khi sinh viên bấm "Điểm danh"
export interface CheckInRequest {
  // MSSV
  studentId: string
  // ID classroom
  // Example: 205/C1: số đầu "2xx/x"= tầng 2 ; "x05/x"= phòng 05; "xxx/C1"= Tòa nhà C1
  // Phải khớp với BLE phát từ ESP32
  roomId: string
  // Mã OTP 6 chữ số mà App đọc được từ BLE Beacon
  otp: string
}

// Data trả về cho Mobile App sau khi sinh viên bấm "Điểm danh"
export interface CheckInResponse {
  success: boolean
  message: string
}

// Document lưu trong Firestore collection "check_ins"
export interface CheckInRecord {
  studentId: string
  roomId: string
  timestamp: FirebaseFirestore.Timestamp
  isLate: boolean
  // Cần mở rộng thì có thể chỉnh thành "method: 'ble-totp' | 'qr-code' | 'nfc' | ..."
  method: 'ble-totp'
}

// Document lưu trong Firestore collection "rooms"
// Mỗi phòng sẽ có Secret key dùng cho thuật toán TOTP
export interface RoomConfig {
  // Tên hiển thị, ví dụ: "Phòng 205/C1"
  name: string
  // Tên viết tắt (Building), ví dụ: "C1"
  building: string
  // Secret key dùng cho thuật toán TOTP (base32 encoded)
  secretKey: string
}
