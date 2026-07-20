#ifndef DISPLAY_UI_H
#define DISPLAY_UI_H

// ============================================================================
// OLED Display UI (SSD1306 128x64)
// ============================================================================
//
// Layout:
//   Line 1 (y=0):  Room Name & HH:MM
//   -------------- separator line --------
//   Line 2 (y=14): Session status text
//   Line 3 (y=28): Late status
//   Line 4 (y=48): Attendance count (large)

/**
 * Initializes the I2C SSD1306 display.
 * Shows a splash screen during boot.
 * @return true if display initialized successfully
 */
bool display_setup();

/**
 * Refreshes the OLED with the current application state.
 * Called periodically (every 1s) from the main loop.
 */
void display_refresh();

#endif // DISPLAY_UI_H
