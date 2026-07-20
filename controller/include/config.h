#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// ============================================================================
// CONFIGURATION - All tuneable parameters in one place
// ============================================================================

// Wi-Fi Credentials
constexpr auto WIFI_SSID     = "YOUR_WIFI_SSID";
constexpr auto WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// MQTT Broker Settings
constexpr auto MQTT_SERVER   = "broker.hivemq.com";
constexpr int  MQTT_PORT     = 1883;
constexpr auto MQTT_USER     = "";  // Leave empty if no auth
constexpr auto MQTT_PASS     = "";  // Leave empty if no auth

// MQTT Topics
constexpr auto TOPIC_RESET   = "attendance/room-101/reset";
constexpr auto TOPIC_SUCCESS = "attendance/room-101/success";
constexpr auto TOPIC_STATUS  = "attendance/room-101/status";

// Room Configuration
constexpr auto       ROOM_NAME  = "Room 101";
constexpr std::array ROOM_ID    = {'R', '1', '0', '1'};  // 4-byte BLE room ID

// NTP Time Configuration
constexpr auto NTP_SERVER    = "pool.ntp.org";
constexpr long GMT_OFFSET    = 3600 * 7;  // UTC+7 (Vietnam)

// TOTP Configuration (RFC 6238)
// This shared secret MUST match the server's secret for OTP validation.
// In production, use a unique per-device key provisioned during enrollment.
constexpr auto TOTP_SECRET   = "JBSWY3DPEHPK3PXP"; // Base32 valid string
constexpr int  TOTP_DIGITS   = 6;        // 6-digit OTP output
constexpr int  TOTP_TIMESTEP = 10;       // OTP changes every 10 seconds

// Hardware Pin Configuration
constexpr int PIN_BUZZER   = 25;
constexpr int PIN_LED      = 26;

// OLED Display Configuration (I2C SSD1306 128x64)
constexpr int     SCREEN_WIDTH  = 128;
constexpr int     SCREEN_HEIGHT = 64;
constexpr int     OLED_RESET    = -1;    // No reset pin
constexpr uint8_t OLED_ADDR     = 0x3C;

// Timing Constants (milliseconds)
constexpr unsigned long BLE_UPDATE_INTERVAL      = 10000; // Rotate BLE payload every 10s
constexpr unsigned long DISPLAY_REFRESH_INTERVAL = 1000;  // Refresh OLED every 1s
constexpr unsigned long FEEDBACK_DURATION        = 500;   // Buzzer/LED on-time
constexpr unsigned long WIFI_RETRY_INTERVAL      = 5000;  // Wi-Fi reconnect interval
constexpr unsigned long MQTT_RETRY_INTERVAL      = 5000;  // MQTT reconnect interval

// Late Threshold
constexpr unsigned long LATE_THRESHOLD_SEC       = 900;   // 15 minutes

#endif // CONFIG_H
