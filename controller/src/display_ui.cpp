#include "display_ui.h"

#include <ctime>

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "config.h"
#include "app_state.h"

static Adafruit_SSD1306 oled(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

bool display_setup()
{
    Serial.print("[OLED] Initializing...");

    if (!oled.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR))
    {
        Serial.println("FAILED! Check wiring.");
        return false;
    }

    Serial.println("OK!");

    // Show splash screen
    oled.clearDisplay();
    oled.setTextSize(1);
    oled.setTextColor(SSD1306_WHITE);
    oled.setCursor(0, 0);
    oled.println("CTU SmartAttendance");
    oled.println("Initializing...");
    oled.display();

    return true;
}

void display_refresh()
{
    oled.clearDisplay();
    oled.setTextColor(SSD1306_WHITE);

    // --- Line 1: Room Name & Current Time ---
    oled.setTextSize(1);
    oled.setCursor(0, 0);
    oled.print(ROOM_NAME);

    tm timeinfo;
    if (getLocalTime(&timeinfo))
    {
        char timeStr[6];
        snprintf(timeStr, sizeof(timeStr), "%02d:%02d",
                 timeinfo.tm_hour, timeinfo.tm_min);
        // Right-align (5 chars * 6px = 30px from right edge)
        oled.setCursor(SCREEN_WIDTH - 30, 0);
        oled.print(timeStr);
    }

    // Separator line
    oled.drawLine(0, 10, SCREEN_WIDTH - 1, 10, SSD1306_WHITE);

    // --- Line 2: Session Status ---
    oled.setTextSize(1);
    oled.setCursor(0, 14);
    if (sessionActive)
    {
        oled.print("Class in Session!");
    }
    else
    {
        oled.print("Waiting for teacher...");
    }

    // --- Line 3: Late Status ---
    oled.setCursor(0, 28);
    if (sessionActive)
    {
        time_t now;
        time(&now);
        if (sessionStartTime > 0 &&
            now - sessionStartTime > static_cast<time_t>(LATE_THRESHOLD_SEC))
        {
            oled.setTextSize(2);
            oled.print("LATE!");
        }
        else
        {
            oled.setTextSize(1);
            oled.print("Status: On Time");
        }
    }
    else
    {
        oled.setTextSize(1);
        oled.print("Status: --");
    }

    // --- Line 4: Attendance Count ---
    oled.setTextSize(2);
    oled.setCursor(0, 48);
    oled.print("N:");
    oled.print(attendanceCount);

    oled.display();
}
