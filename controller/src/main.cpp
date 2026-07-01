/*
 * SMART ATTENDANCE BLE HUB (ESP32)
 * Architecture: Edge Gateway (BLE Scanner -> Wi-Fi -> MQTT)
 * * This device continuously scans for BLE advertising packets containing a specific
 * Service UUID. When a matching packet is found, it extracts the student ID from 
 * the Service Data, debounces the read, and pushes it to a FreeRTOS queue.
 * The main loop processes the queue and publishes JSON payloads to an MQTT broker.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <NimBLEDevice.h>
#include <NimBLEScan.h>
#include <NimBLEAdvertisedDevice.h>
#include <time.h>
#include <etl/map.h>
#include <etl/string.h>
#include "message.pb.h"
#include "pb_encode.h"

// ==========================================
// CONFIGURATION
// ==========================================

// Wi-Fi Credentials
constexpr auto ssid = "YOUR_WIFI_SSID";
constexpr auto password = "YOUR_WIFI_PASSWORD";

// MQTT Broker Settings
constexpr auto mqtt_server = "broker.hivemq.com";
constexpr int mqtt_port = 1883;
constexpr auto mqtt_user = "YOUR_MQTT_USER"; // Leave empty string if no auth
constexpr auto mqtt_pass = "YOUR_MQTT_PASS"; // Leave empty string if no auth
constexpr auto mqtt_topic = "attendance/room-101/check-in";

// BLE Configuration
// This is the UUID the student smartphone app MUST broadcast
constexpr auto TARGET_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";

// Debounce & Range Configuration
constexpr int RSSI_THRESHOLD = -80; // Ignore signals weaker than this (geofencing)
constexpr unsigned long DEBOUNCE_TIME_MS = 60000; // Ignore duplicate student IDs for 60 seconds

// NTP Time Configuration
constexpr auto ntpServer = "pool.ntp.org";
constexpr long gmtOffset_sec = 3600 * 7;

constexpr int STUDENT_ID_LENGTH = 12;

// ==========================================
// GLOBAL VARIABLES & STRUCTURES
// ==========================================

WiFiClient espClient;
PubSubClient mqttClient(espClient);
BLEScan* pBLEScan;

// Map to keep track of when we last saw a student ID to prevent spamming
etl::map<etl::string<STUDENT_ID_LENGTH>, unsigned long, 500> lastSeenMap;

// Structure to hold attendance data in the queue
struct AttendanceRecord
{
    etl::string<STUDENT_ID_LENGTH> studentId;
    int rssi;
    time_t timestamp;
};

// FreeRTOS Queue to buffer offline records
QueueHandle_t attendanceQueue;
constexpr int QUEUE_SIZE = 500; // Buffer up to 50 students if Wi-Fi drops

// ==========================================
// BLE CALLBACK HANDLER
// ==========================================
class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
{
public:
    void onResult(const BLEAdvertisedDevice* advertisedDevice) override
    {
        // 1. Check if the advertised packet contains our target Service UUID
        if (advertisedDevice->haveServiceUUID() &&
            advertisedDevice->getServiceUUID().equals(BLEUUID(TARGET_SERVICE_UUID)))
        {
            const int rssi = advertisedDevice->getRSSI();

            // 2. Filter out devices that are too far away
            if (rssi < RSSI_THRESHOLD)
            {
                return; // Device is outside the classroom
            }

            // 3. Extract the Student ID from the Service Data
            // The student app must put their ID in the Service Data field of the broadcast
            if (advertisedDevice->haveServiceData())
            {
                const auto serviceData = advertisedDevice->getServiceData(BLEUUID(TARGET_SERVICE_UUID));
                etl::string<STUDENT_ID_LENGTH> studentId{serviceData.c_str()};

                // 4. Debounce check: Have we seen this student recently?
                const unsigned long currentMillis = millis();
                if (lastSeenMap.find(studentId) != lastSeenMap.end())
                {
                    if (currentMillis - lastSeenMap[studentId] < DEBOUNCE_TIME_MS)
                    {
                        return; // Ignore, seen too recently
                    }
                }

                // Update the last seen time
                lastSeenMap[studentId] = currentMillis;

                // 5. Get current timestamp from NTP
                time_t now;
                time(&now);

                // 6. Create record and push to FreeRTOS Queue
                const AttendanceRecord record {
                    .studentId = std::move(studentId),
                    .rssi = rssi,
                    .timestamp = now
                };

                // Non-blocking send to queue. If queue is full, it drops the packet.
                if (xQueueSend(attendanceQueue, &record, 0) == pdPASS)
                {
                    Serial.print("BLE Detected -> Student: ");
                    Serial.print(record.studentId.c_str());
                    Serial.print(" | RSSI: ");
                    Serial.println(record.rssi);
                }
                else
                {
                    Serial.println("Warning: Attendance Queue is FULL. Record dropped.");
                }
            }
        }
    }
};

// ==========================================
// SETUP FUNCTIONS
// ==========================================

void setup_wifi()
{
    delay(10);
    Serial.println();
    Serial.print("Connecting to Wi-Fi: ");
    Serial.println(ssid);

    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWi-Fi connected.");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void setup_ntp()
{
    Serial.print("Syncing time with NTP...");
    configTime(gmtOffset_sec, 0, ntpServer);

    tm timeinfo;
    while (!getLocalTime(&timeinfo))
    {
        Serial.print(".");
        delay(1000);
    }
    Serial.println("\nTime Synced!");
}

void reconnect_mqtt()
{
    // Loop until we're reconnected
    while (!mqttClient.connected())
    {
        Serial.print("Attempting MQTT connection...");
        String clientId = "ESP32ClassroomHub-";
        clientId += String(random(0xffff), HEX);

        // Connect with LWT (Last Will and Testament) for device health tracking
        if (mqttClient.connect(clientId.c_str(), mqtt_user, mqtt_pass, "attendance/room-101/status", 1, true,
                               "offline"))
        {
            Serial.println("connected");
            mqttClient.publish("attendance/room-101/status", "online", true);
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

// ==========================================
// MAIN SETUP
// ==========================================
void setup()
{
    Serial.begin(115200);

    // Initialize FreeRTOS Queue
    attendanceQueue = xQueueCreate(QUEUE_SIZE, sizeof(AttendanceRecord));
    if (attendanceQueue == nullptr)
    {
        Serial.println("Error creating the queue");
        while (true); // Halt
    }

    // Initialize Network & Time
    setup_wifi();
    setup_ntp();

    mqttClient.setServer(mqtt_server, mqtt_port);

    // Initialize BLE Scanning
    Serial.println("Initializing BLE Scanner...");
    BLEDevice::init("ESP32_Hub");
    pBLEScan = BLEDevice::getScan();
    pBLEScan->setScanCallbacks(new MyAdvertisedDeviceCallbacks());
    pBLEScan->setActiveScan(true); // Active scan reads full payload
    pBLEScan->setInterval(100);
    pBLEScan->setWindow(99); // Scan almost continuously

    // Start scanning continuously (0 = run forever)
    pBLEScan->start(0, false);
    Serial.println("BLE Scanning Started.");
}

// ==========================================
// MAIN LOOP
// ==========================================
void loop()
{
    // 1. Maintain Network connections
    if (WiFi.status() != WL_CONNECTED)
    {
        setup_wifi();
    }

    if (!mqttClient.connected())
    {
        reconnect_mqtt();
    }

    mqttClient.loop();

    // 2. Process the FreeRTOS Attendance Queue
    AttendanceRecord record;

    // Check if there is data in the queue
    if (xQueueReceive(attendanceQueue, &record, 0) == pdPASS)
    {
        // If MQTT is connected, publish the data
        if (mqttClient.connected())
        {
            StudentCheckIn msg = StudentCheckIn_init_zero;
            strcpy(msg.student_id, record.studentId.c_str());
            msg.timestamp = { .seconds=record.timestamp, .nanos=0 };
            strcpy(msg.action, "check_in");
            msg.rssi = record.rssi;

            uint8_t buffer[256];
            pb_ostream_t ostream;
            ostream = pb_ostream_from_buffer(buffer, sizeof(buffer));
            pb_encode(&ostream, &StudentCheckIn_msg, &msg);

            // Publish message. If successful, it's removed from queue implicitly.
            if (mqttClient.publish(mqtt_topic, buffer, ostream.bytes_written))
            {
                Serial.printf("Student checked in: %s at %lld\n", msg.student_id, msg.timestamp.seconds);
            }
            else
            {
                Serial.println("Failed to publish, pushing back to queue.");
                // Push back to the front of the queue to try again
                xQueueSendToFront(attendanceQueue, &record, 0);
                delay(1000); // Brief delay before retrying
            }
        }
        else
        {
            // No MQTT connection? Keep it in the queue for later!
            Serial.println("MQTT disconnected. Record buffered in queue.");
            xQueueSendToFront(attendanceQueue, &record, 0);
        }
    }

    // Short delay to yield to FreeRTOS watchdog
    delay(10);
}
