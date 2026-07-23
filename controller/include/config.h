#pragma once

#include <Arduino.h>

// ============================================================================
// CONFIGURATION - All tunable parameters in one place
// ============================================================================

// Wi-Fi Credentials
constexpr auto WIFI_SSID     = "YOUR_WIFI_SSID";
constexpr auto WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// MQTT Broker Settings
constexpr auto MQTT_SERVER   = "localhost";
constexpr int  MQTT_PORT     = 1883;
constexpr auto MQTT_USER     = "";  // Leave empty if no auth
constexpr auto MQTT_PASS     = "";  // Leave empty if no auth

// MQTT Topics
constexpr auto TOPIC_RESET   = "attendance/" ROOM_UUID_STRING "/reset";
constexpr auto TOPIC_SUCCESS = "attendance/" ROOM_UUID_STRING "/success";
constexpr auto TOPIC_STATUS  = "attendance/" ROOM_UUID_STRING "/status";

// Room Configuration
constexpr auto  ROOM_NAME  = "Room 101";
constexpr std::array<uint8_t, 16> ROOM_UUID    = {'R', '1', '0', '1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};  // 16-byte BLE room UUID

// NTP Time Configuration
constexpr auto NTP_SERVER    = "time.google.com";
constexpr long GMT_OFFSET    = 3600 * 7;  // UTC+7 (Vietnam)

// TOTP Configuration (RFC 6238)
// This shared secret MUST match the server's secret for OTP validation.
// In production, use a unique per-device key provisioned during enrollment.
constexpr int  TOTP_DIGITS   = 6;        // 6-digit OTP output
constexpr int  TOTP_TIMESTEP = 30;       // OTP changes every 30 seconds

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
