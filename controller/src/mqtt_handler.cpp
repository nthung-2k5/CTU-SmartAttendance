#include "mqtt_handler.h"
#include "config.h"
#include "app_state.h"
#include "feedback.h"
#include <WiFi.h>
#include "message.pb.h"
#include "pb_decode.h"

// ============================================================================
// MQTT Client Instance
// ============================================================================
static WiFiClient espClient;
static PubSubClient mqttClient(espClient);

PubSubClient& mqtt_get_client()
{
    return mqttClient;
}

// ============================================================================
// MQTT Callback
// ============================================================================

/**
 * Dispatches incoming MQTT messages to the appropriate handler.
 *
 * Topic: attendance/room-101/reset
 *   -> Decodes SessionReset protobuf. Resets counter, saves session start.
 *
 * Topic: attendance/room-101/success
 *   -> Decodes AttendanceSuccess protobuf. Increments counter, triggers feedback.
 */
static void mqtt_callback(char* topic, const byte* payload, const unsigned int length)
{
    Serial.printf("[MQTT] Message on topic: %s (%u bytes)\n", topic, length);

    // --- Handle Session Reset ---
    if (strcmp(topic, TOPIC_RESET) == 0)
    {
        SessionReset resetMsg = SessionReset_init_zero;
        pb_istream_t stream = pb_istream_from_buffer(payload, length);

        if (pb_decode(&stream, &SessionReset_msg, &resetMsg))
        {
            sessionStartTime = resetMsg.session_start;
            sessionActive = true;
            attendanceCount = 0;

            Serial.println("[Session] *** NEW SESSION STARTED ***");
            Serial.printf("[Session] Start time (Unix): %lld\n",
                          static_cast<long long>(sessionStartTime));
            Serial.println("[Session] Attendance counter reset to 0.");
        }
        else
        {
            // Fallback: use current time if protobuf decode fails
            Serial.println("[Session] Protobuf decode failed. Using current time.");
            time_t now{};
            time(&now);
            sessionStartTime = now;
            sessionActive = true;
            attendanceCount = 0;
        }

        // Force immediate display and BLE refresh
        lastDisplayRefresh = 0;
        lastBleUpdate = 0;
    }

    // --- Handle Attendance Success ---
    else if (strcmp(topic, TOPIC_SUCCESS) == 0)
    {
        AttendanceSuccess successMsg = AttendanceSuccess_init_zero;
        pb_istream_t stream = pb_istream_from_buffer(payload, length);

        if (pb_decode(&stream, &AttendanceSuccess_msg, &successMsg))
        {
            attendanceCount.fetch_add(1, std::memory_order::acq_rel);
            Serial.printf("[Attendance] Student checked in: %s (%s) | Total: %d\n",
                          successMsg.student_id, successMsg.student_name, attendanceCount.load(std::memory_order::acquire));
        }
        else
        {
            attendanceCount.fetch_add(1, std::memory_order::acq_rel);
            Serial.printf("[Attendance] Check-in confirmed (decode failed). Total: %d\n",
                          attendanceCount.load(std::memory_order::acquire));
        }

        // Trigger non-blocking buzzer & LED feedback
        feedback_trigger();

        // Force immediate display update
        lastDisplayRefresh = 0;
    }
}

// ============================================================================
// Public API
// ============================================================================

void mqtt_setup()
{
    mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
    mqttClient.setCallback(mqtt_callback);
    mqttClient.setBufferSize(512);  // Increase buffer for protobuf messages
}

bool mqtt_try_reconnect()
{
    Serial.print("[MQTT] Attempting connection...");

    String clientId = "ESP32-Beacon-";
    clientId += String(random(0xffff), HEX);

    // Connect with Last Will and Testament for health monitoring
    bool connected = false;
    if (strlen(MQTT_USER) > 0)
    {
        connected = mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS,
                                       TOPIC_STATUS, 1, true, "offline");
    }
    else
    {
        connected = mqttClient.connect(clientId.c_str(), nullptr, nullptr,
                                       TOPIC_STATUS, 1, true, "offline");
    }

    if (connected)
    {
        Serial.println("connected!");
        mqttClient.publish(TOPIC_STATUS, "online", true);

        // Subscribe to command & feedback topics
        mqttClient.subscribe(TOPIC_RESET, 1);
        mqttClient.subscribe(TOPIC_SUCCESS, 1);

        Serial.println("[MQTT] Subscribed to topics:");
        Serial.printf("  -> %s\n", TOPIC_RESET);
        Serial.printf("  -> %s\n", TOPIC_SUCCESS);
    }
    else
    {
        Serial.print("failed (rc=");
        Serial.print(mqttClient.state());
        Serial.println("). Will retry later.");
    }

    return connected;
}
