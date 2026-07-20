#ifndef FEEDBACK_H
#define FEEDBACK_H

// ============================================================================
// Non-Blocking Feedback Controller (Buzzer + Green LED)
// ============================================================================
// Provides visual and auditory feedback when a student check-in is confirmed.
// Uses millis()-based timing — strictly no delay() calls.

/**
 * Initializes the buzzer and LED GPIO pins.
 * Call once during setup().
 */
void feedback_setup();

/**
 * Triggers the buzzer and green LED for FEEDBACK_DURATION ms.
 * Non-blocking: records start time and sets pins HIGH.
 * Must be paired with feedback_handle() in loop().
 */
void feedback_trigger();

/**
 * Polls for feedback timeout. Call every loop() iteration.
 * Turns off buzzer and LED once FEEDBACK_DURATION has elapsed.
 * Uses millis() comparison — completely non-blocking.
 */
void feedback_handle();

#endif // FEEDBACK_H
