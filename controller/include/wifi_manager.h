#pragma once

// ============================================================================
// Wi-Fi Manager
// ============================================================================
// Handles initial Wi-Fi connection (blocking, for setup()) and
// non-blocking reconnection attempts for use in loop().

/**
 * Blocking Wi-Fi connection. Use only during setup().
 * Attempts up to 20 seconds before giving up.
 */
void wifi_setup();

/**
 * Synchronizes system clock via NTP. Blocking during setup().
 * Accurate time is critical for TOTP generation.
 */
void wifi_setup_ntp();

/**
 * Non-blocking Wi-Fi reconnection attempt for use in loop().
 * Simply calls WiFi.begin() and returns immediately.
 */
void wifi_try_reconnect();
