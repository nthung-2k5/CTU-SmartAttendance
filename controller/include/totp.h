#pragma once

#include <span>
#include <Arduino.h>

// ============================================================================
// RFC 6238 TOTP (Time-Based One-Time Password)
// ============================================================================
//
// Implements the TOTP algorithm per RFC 6238, using HMAC-SHA1 (RFC 2104)
// via the ESP32's built-in mbedtls library.
//
// Algorithm overview:
//   1. T = floor((unix_time - T0) / timestep)   [T0=0 per spec]
//   2. Convert T to an 8-byte big-endian counter
//   3. HMAC = HMAC-SHA1(secret, counter)
//   4. offset = HMAC[19] & 0x0F
//   5. code = (HMAC[offset..offset+3] & 0x7FFFFFFF) % 10^digits
//
// The shared secret and timestep are configured in config.h.
// Both the ESP32 and the validation server must use the same secret
// and timestep to independently generate matching OTPs.

/**
 * Generates a TOTP code for the given Unix timestamp.
 *
 * @param secret     Shared secret key (raw bytes, NOT base32 encoded)
 * @param secretLen  Length of the secret in bytes
 * @param unixTime   Current Unix timestamp (seconds since epoch)
 * @param timeStep   Time step in seconds (e.g., 10 for 10-second rotation)
 * @param digits     Number of OTP digits (typically 6)
 * @return           The TOTP code as a uint32_t (e.g., 482017)
 */
uint32_t totp_generate(const uint8_t* secret, size_t secretLen,
                       time_t unixTime, int timeStep, int digits);

/**
 * Convenience wrapper that uses the config.h defaults.
 * Generates a 6-digit TOTP using TOTP_SECRET and TOTP_TIMESTEP.
 *
 * @param unixTime  Current Unix timestamp
 * @return          The 6-digit TOTP code
 */
uint32_t totp_generate_default(time_t unixTime);

/**
 * Formats a TOTP code into a zero-padded string.
 * @tparam Digits  Number of digits to format
 * @param code    The TOTP code value
 * @param outBuf  Output buffer (must be at least digits+1 bytes)
 */
template<unsigned int Digits>
void totp_format(uint32_t code, std::span<char, Digits + 1> outBuf)
{
    outBuf[Digits] = '\0';

    for (int i = Digits - 1; i >= 0; --i) {
        outBuf[i] = '0' + code % 10;
        code /= 10;
    }
}
