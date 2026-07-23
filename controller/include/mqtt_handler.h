#pragma once

#include <PubSubClient.h>

// ============================================================================
// MQTT Handler
// ============================================================================
// Manages MQTT connection, subscriptions, and message dispatch.
// Decodes incoming protobuf messages and updates shared application state.

/**
 * Returns a reference to the global PubSubClient instance.
 * Modules that need to check mqttClient.connected() or call mqttClient.loop()
 * should use this accessor.
 */
PubSubClient& mqtt_get_client();

/**
 * Initializes the MQTT client (server, callback, buffer size).
 * Call once during setup().
 */
void mqtt_setup();

/**
 * Non-blocking MQTT reconnection attempt.
 * Makes a single connection attempt and returns immediately.
 * @return true if connection was established, false otherwise.
 */
bool mqtt_try_reconnect();
