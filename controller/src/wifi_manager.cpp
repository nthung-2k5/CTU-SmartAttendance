#include "wifi_manager.h"
#include "config.h"
#include <WiFi.h>
#include <esp_sntp.h>

void wifi_setup()
{
    Serial.println();
    Serial.print("[WiFi] Connecting to ");
    Serial.println(WIFI_SSID);

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    // Blocking wait during initial setup only
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 40)
    {
        delay(500);
        Serial.print(".");
        retries++;
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("\n[WiFi] Connected!");
        Serial.print("[WiFi] IP: ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println("\n[WiFi] Initial connection failed. Will retry in loop().");
    }
}

void wifi_setup_ntp()
{
    Serial.print("[NTP] Syncing time...");
    sntp_set_sync_interval(3600 * 1000); // 1 hour resynchronize interval

    configTime(GMT_OFFSET, 0, NTP_SERVER);

    tm timeInfo;
    int retries = 0;
    while (!getLocalTime(&timeInfo) && retries < 20)
    {
        Serial.print(".");
        delay(1000);
        retries++;
    }

    if (retries < 20)
    {
        Serial.println("\n[NTP] Time synced!");
        Serial.printf("[NTP] Current time: %02d:%02d:%02d\n",
                      timeInfo.tm_hour, timeInfo.tm_min, timeInfo.tm_sec);
    }
    else
    {
        Serial.println("\n[NTP] Time sync failed! TOTP will be unreliable.");
    }
}

void wifi_try_reconnect()
{
    Serial.println("[WiFi] Disconnected. Attempting reconnect...");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    // Result checked next loop() iteration (non-blocking)
}
