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


