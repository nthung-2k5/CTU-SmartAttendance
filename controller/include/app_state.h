#ifndef APP_STATE_H
#define APP_STATE_H

#include <ctime>
#include <atomic>

// ============================================================================
// SHARED APPLICATION STATE
// ============================================================================
// These variables are shared across multiple modules (MQTT, BLE, Display).
// They are defined in main.cpp and declared extern here.

// Session state
extern std::atomic_int attendanceCount;     // Live count, updated via MQTT callback
extern time_t          sessionStartTime;    // Unix timestamp of session start (0 = none)
extern bool            sessionActive;       // Whether a class session is in progress

// Non-blocking timing state machines (used in main.cpp loop)
extern unsigned long   lastBleUpdate;
extern unsigned long   lastDisplayRefresh;
extern unsigned long   lastWifiRetry;
extern unsigned long   lastMqttRetry;

// Feedback state machine
extern bool            feedbackActive;
extern unsigned long   feedbackStartTime;

#endif // APP_STATE_H
