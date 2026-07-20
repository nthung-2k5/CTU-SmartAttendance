/*
 * RFC 6238 TOTP Implementation for ESP32
 *
 * Uses mbedtls HMAC-SHA1 (built into the ESP32 Arduino framework).
 * No additional libraries required.
 *
 * References:
 *   - RFC 6238: TOTP Algorithm
 *   - RFC 4226: HOTP Algorithm (base for TOTP)
 *   - RFC 2104: HMAC
 */

#include "totp.h"
#include "config.h"
#include <mbedtls/md.h>
#include <string.h>

// SHA-1 produces a 20-byte digest
static constexpr int SHA1_DIGEST_LEN = 20;

/**
 * Core TOTP generation per RFC 6238.
 *
 * Steps:
 *   1. Compute T = floor(unixTime / timeStep)
 *   2. Encode T as an 8-byte big-endian value
 *   3. Compute HMAC-SHA1(secret, T_bytes)
 *   4. Dynamic truncation (RFC 4226 Section 5.4):
 *      - offset = hmac[19] & 0x0F
 *      - binary = (hmac[offset]   & 0x7F) << 24
 *               | (hmac[offset+1] & 0xFF) << 16
 *               | (hmac[offset+2] & 0xFF) << 8
 *               | (hmac[offset+3] & 0xFF)
 *      - otp = binary % 10^digits
 */
uint32_t totp_generate(const uint8_t* secret, const size_t secretLen,
                       const time_t unixTime, const int timeStep, const int digits)
{
    // Step 1: Calculate time counter T
    uint64_t T = static_cast<uint64_t>(unixTime / timeStep);

    // Step 2: Encode T as 8-byte big-endian
    uint8_t timeBytes[8];
    for (int i = 7; i >= 0; i--)
    {
        timeBytes[i] = static_cast<uint8_t>(T & 0xFF);
        T >>= 8;
    }

    // Step 3: Compute HMAC-SHA1(secret, timeBytes)
    uint8_t hmacResult[SHA1_DIGEST_LEN];

    mbedtls_md_context_t ctx;
    mbedtls_md_init(&ctx);

    const mbedtls_md_info_t* mdInfo = mbedtls_md_info_from_type(MBEDTLS_MD_SHA1);
    mbedtls_md_setup(&ctx, mdInfo, 1); // 1 = enable HMAC
    mbedtls_md_hmac_starts(&ctx, secret, secretLen);
    mbedtls_md_hmac_update(&ctx, timeBytes, sizeof(timeBytes));
    mbedtls_md_hmac_finish(&ctx, hmacResult);
    mbedtls_md_free(&ctx);

    // Step 4: Dynamic Truncation (RFC 4226 Section 5.4)
    const int offset = hmacResult[SHA1_DIGEST_LEN - 1] & 0x0F;

    const uint32_t binary =
        static_cast<uint32_t>(hmacResult[offset] & 0x7F) << 24 |
        static_cast<uint32_t>(hmacResult[offset + 1] & 0xFF) << 16 |
        static_cast<uint32_t>(hmacResult[offset + 2] & 0xFF) << 8 |
        static_cast<uint32_t>(hmacResult[offset + 3] & 0xFF);

    // Step 5: Compute modulo to get the desired number of digits
    uint32_t mod = 1;
    for (int i = 0; i < digits; i++)
    {
        mod *= 10;
    }

    return binary % mod;
}

/**
 * Base32 decoder for the secret.
 */
static constexpr int base32_decode_char(const char c) {
    if (c >= 'A' && c <= 'Z') return c - 'A';
    if (c >= 'a' && c <= 'z') return c - 'a';
    if (c >= '2' && c <= '7') return c - '2' + 26;
    return -1;
}

static size_t base32_decode(const char* encoded, uint8_t* output) {
    int buffer = 0;
    int bitsLeft = 0;
    size_t outLen = 0;
    
    while (*encoded) {
        if (const int val = base32_decode_char(*encoded++); val >= 0) {
            buffer = buffer << 5 | val;
            bitsLeft += 5;
            if (bitsLeft >= 8) {
                output[outLen++] = buffer >> (bitsLeft - 8) & 0xFF;
                bitsLeft -= 8;
            }
        }
    }
    return outLen;
}

/**
 * Convenience wrapper using config.h defaults.
 */
uint32_t totp_generate_default(const time_t unixTime)
{
    uint8_t secretBytes[64];
    const size_t secretLen = base32_decode(TOTP_SECRET, secretBytes);

    return totp_generate(
        secretBytes,
        secretLen,
        unixTime,
        TOTP_TIMESTEP,
        TOTP_DIGITS
    );
}
