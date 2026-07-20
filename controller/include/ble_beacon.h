#ifndef BLE_BEACON_H
#define BLE_BEACON_H

// ============================================================================
// BLE Beacon (Non-Connectable Broadcaster)
// ============================================================================
//
// Broadcasts a manufacturer-specific BLE advertisement containing:
//   - Room ID (4 bytes)
//   - RFC 6238 TOTP code (6 ASCII characters)
//   - Late flag (1 byte: 0=on-time, 1=late)
//
// Payload Structure (Manufacturer Specific Data):
// +--------+-----------+--------+-----------+
// | Offset | Field     | Size   | Example   |
// +--------+-----------+--------+-----------+
// | 0-1    | Company ID| 2B     | 0xFFFF    |
// | 2-5    | Room ID   | 4B     | "R101"    |
// | 6-11   | TOTP OTP  | 6B     | "482017"  |
// | 12     | Late Flag | 1B     | 0 or 1    |
// +--------+-----------+--------+-----------+
// Total: 13 bytes

/**
 * Initializes NimBLE as a non-connectable broadcaster.
 * Configures advertising parameters and sets the initial payload.
 * Call once during setup().
 */
void ble_setup();

/**
 * Updates the BLE advertisement payload with the current TOTP and late flag.
 * Called periodically (every 10s) from the main loop via millis() state machine.
 */
void ble_update_payload();

#endif // BLE_BEACON_H
