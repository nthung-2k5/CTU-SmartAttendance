#pragma once

// ============================================================================
// BLE Beacon (Non-Connectable Broadcaster)
// ============================================================================
//
// Broadcasts a manufacturer-specific BLE advertisement containing:
//   - Room UUID (16 bytes)
//   - RFC 6238 TOTP code (6 ASCII characters)
//
// Payload Structure (Manufacturer Specific Data):
// +--------+-----------+--------+-----------+
// | Offset | Field     | Size   | Example   |
// +--------+-----------+--------+-----------+
// | 0-1    | Company ID| 2B     | 0xFFFF    |
// | 2-17   | Room UUID | 16B    |           |
// | 18-23  | TOTP OTP  | 6B     | "482017"  |
// +--------+-----------+--------+-----------+
// Total: 24 bytes

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
