#include "ble_beacon.h"

#include <ctime>
#include <vector>

#include <NimBLEDevice.h>
#include <NimBLEAdvertising.h>

#include "config.h"
#include "app_state.h"
#include "totp.h"

static NimBLEAdvertising* pAdvertising = nullptr;

void ble_setup()
{
    Serial.print("[BLE] Initializing broadcaster...");
    NimBLEDevice::init("CTU-Attendance");

    pAdvertising = NimBLEDevice::getAdvertising();

    // Non-connectable: broadcast only, no BLE connections accepted
    pAdvertising->setConnectableMode(BLE_GAP_CONN_MODE_NON);
    pAdvertising->enableScanResponse(false);

    pAdvertising->setMinInterval(160);  // 100ms (160 * 0.625ms)
    pAdvertising->setMaxInterval(320);  // 200ms (320 * 0.625ms)

    // Set initial payload
    ble_update_payload();
    Serial.println("OK! Broadcasting started.");
}

/**
 * Rebuilds and restarts the BLE advertisement with fresh data.
 *
 * OTP is generated using RFC 6238 TOTP (HMAC-SHA1) with the shared
 * secret from config.h. The timestep is 30 seconds.
 */
void ble_update_payload()
{
    // Get current Unix timestamp
    time_t now{};
    time(&now);

    // Generate RFC 6238 TOTP
    const uint32_t otpCode = totp_generate_default(now);

    // Format as zero-padded 6-digit string
    std::array<char, 7> otpStr{};
    totp_format<TOTP_DIGITS>(otpCode, otpStr);

    // Build manufacturer-specific data payload
    // Layout: [CompanyID(2)] [RoomUUID(16)] [OTP(6)] = 24 bytes
    std::vector<uint8_t> mfgData;
    mfgData.reserve(24);

    // Company ID (0xFFFF = test/prototype, little-endian)
    mfgData.push_back(0xFF);
    mfgData.push_back(0xFF);

    // Room UUID (16 bytes)
    for (int i = 0; i < ROOM_UUID.size(); i++)
    {
        mfgData.push_back(ROOM_UUID.at(i));
    }

    // OTP (6 ASCII characters)
    for (int i = 0; i < otpStr.size(); i++)
    {
        mfgData.push_back(otpStr.at(i));
    }

    // Stop -> update -> restart advertising
    pAdvertising->stop();

    NimBLEAdvertisementData advData;
    advData.setFlags(BLE_HS_ADV_F_BREDR_UNSUP);  // BLE-only
    advData.setName("CTU-Attendance");
    advData.setManufacturerData(mfgData);

    pAdvertising->setAdvertisementData(advData);
    pAdvertising->start();

    Serial.printf("[BLE] Payload updated -> OTP: %s (RFC6238)", otpStr.data());
}
