/*
 * ===========================================================================
 * CTU SMART CLASSROOM ATTENDANCE BEACON & FEEDBACK HUB (ESP32)
 * ===========================================================================
 *
 * Architecture: Client-Push OTP Model (BLE Broadcaster + MQTT Subscriber)
 *
 * This ESP32 does NOT scan for BLE devices. Instead, it:
 *   1. Broadcasts a BLE advertisement containing an RFC 6238 TOTP,
 *      a room identifier, and a late flag.
 *   2. Subscribes to MQTT topics for session resets and check-in
 *      confirmations (decoded via nanopb/protobuf).
 *   3. Provides real-time feedback via OLED display, buzzer, and LED.
 *
 * Module Structure:
 *   config.h       - All tuneable parameters
 *   app_state.h    - Shared state (extern declarations)
 *   totp.h/cpp     - RFC 6238 TOTP (HMAC-SHA1 via mbedtls)
 *   wifi_manager   - Wi-Fi connection & NTP sync
 *   mqtt_handler   - MQTT connection, subscriptions & protobuf decode
 *   ble_beacon     - BLE non-connectable broadcaster
 *   display_ui     - SSD1306 OLED rendering
 *   feedback       - Non-blocking buzzer/LED control
 *
 * Non-Blocking Design:
 *   ALL timing in loop() uses millis()-based state machines.
 *   Strictly NO delay() calls in the main loop.
 */

#include <Arduino.h>
#include <WiFi.h>

#include "config.h"
#include "app_state.h"
#include "wifi_manager.h"
#include "mqtt_handler.h"
#include "ble_beacon.h"
#include "display_ui.h"
#include "feedback.h"

// ============================================================================
// SHARED STATE DEFINITIONS (declared extern in app_state.h)
// ============================================================================
std::atomic_int attendanceCount    = 0;
time_t          sessionStartTime   = 0;
bool            sessionActive      = false;

unsigned long   lastBleUpdate      = 0;
unsigned long   lastDisplayRefresh = 0;
unsigned long   lastWifiRetry      = 0;
unsigned long   lastMqttRetry      = 0;

bool            feedbackActive     = false;
unsigned long   feedbackStartTime  = 0;

// ============================================================================
// SETUP
// ============================================================================
void setup()
{
    Serial.begin(115200);
    Serial.println("\n========================================");
    Serial.println(" CTU Smart Attendance Beacon v2.1");
    Serial.println(" OTP: RFC 6238 TOTP (HMAC-SHA1)");
    Serial.println(" Architecture: BLE Broadcaster + MQTT");
    Serial.println("========================================\n");

    // Initialize hardware
    feedback_setup();
    display_setup();

    // Initialize network & time
    wifi_setup();
    wifi_setup_ntp();

    // Initialize MQTT
    mqtt_setup();
    if (WiFi.status() == WL_CONNECTED)
    {
        mqtt_try_reconnect();
    }

    // Initialize BLE broadcaster
    ble_setup();

    // Initial display refresh
    display_refresh();

    Serial.println("\n[System] Setup complete. Entering main loop.\n");
}

// ============================================================================
// LOOP — Fully non-blocking millis() state machine
// ============================================================================
void loop()
{
    const unsigned long currentMillis = millis();

    // 1. Wi-Fi health: non-blocking reconnection
    if (WiFi.status() != WL_CONNECTED)
    {
        if (currentMillis - lastWifiRetry >= WIFI_RETRY_INTERVAL)
        {
            lastWifiRetry = currentMillis;
            wifi_try_reconnect();
        }
    }

    // 2. MQTT health: non-blocking reconnection
    PubSubClient& mqtt = mqtt_get_client();
    if (WiFi.status() == WL_CONNECTED)
    {
        if (!mqtt.connected())
        {
            if (currentMillis - lastMqttRetry >= MQTT_RETRY_INTERVAL)
            {
                lastMqttRetry = currentMillis;
                mqtt_try_reconnect();
            }
        }
        else
        {
            mqtt.loop();  // Process incoming MQTT messages
        }
    }

    // 3. BLE payload rotation: update TOTP every 10 seconds
    if (currentMillis - lastBleUpdate >= BLE_UPDATE_INTERVAL)
    {
        lastBleUpdate = currentMillis;
        ble_update_payload();
    }

    // 4. OLED display refresh: every 1 second
    if (currentMillis - lastDisplayRefresh >= DISPLAY_REFRESH_INTERVAL)
    {
        lastDisplayRefresh = currentMillis;
        display_refresh();
    }

    // 5. Feedback state machine: non-blocking buzzer/LED timeout
    feedback_handle();

    // No delay() — ESP32 remains maximally responsive to MQTT messages
}
