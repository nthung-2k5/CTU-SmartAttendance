#include "feedback.h"

#include "config.h"
#include "app_state.h"

void feedback_setup()
{
    pinMode(PIN_BUZZER, OUTPUT);
    pinMode(PIN_LED, OUTPUT);
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_LED, LOW);
}

void feedback_trigger()
{
    feedbackActive = true;
    feedbackStartTime = millis();

    digitalWrite(PIN_BUZZER, HIGH);
    digitalWrite(PIN_LED, HIGH);

    Serial.println("[Feedback] Buzzer + LED ON");
}

void feedback_handle()
{
    if (feedbackActive)
    {
        if (millis() - feedbackStartTime >= FEEDBACK_DURATION)
        {
            digitalWrite(PIN_BUZZER, LOW);
            digitalWrite(PIN_LED, LOW);
            feedbackActive = false;

            Serial.println("[Feedback] Buzzer + LED OFF");
        }
    }
}
