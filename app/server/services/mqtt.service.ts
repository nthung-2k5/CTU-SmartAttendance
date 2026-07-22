import { create, toBinary } from '@bufbuild/protobuf'
import { AttendanceSuccessSchema, SessionResetSchema } from '@server/protobuf/message_pb'
import mqtt from 'mqtt'

// Connect to HiveMQ public broker (as used in the ESP32 code)
const client = mqtt.connect('mqtt://broker.hivemq.com')

client.on('connect', async () => {
  console.log('[MQTT] Connected to broker')
  try {
    console.log('[MQTT] Protobuf schema loaded')
  } catch (error) {
    console.error('[MQTT] Failed to load protobuf schema:', error)
  }
})

client.on('error', (error) => {
  console.error('[MQTT] Connection error:', error)
})

export async function publishAttendanceSuccess(roomId: string, studentId: string, studentName: string) {
  if (!client.connected) {
    console.warn('[MQTT] Client not ready to publish')
    return
  }

  const topic = `attendance/${roomId}/success`

  const payload = create(AttendanceSuccessSchema, {
    studentId: studentId,
    studentName: studentName,
    timestamp: BigInt(Date.now()),
  })

  const buffer = toBinary(AttendanceSuccessSchema, payload)

  client.publish(topic, buffer as Buffer, { qos: 1 }, (error) => {
    if (error) {
      console.error(`[MQTT] Publish error on ${topic}:`, error)
    } else {
      console.log(`[MQTT] Published AttendanceSuccess to ${topic}`)
    }
  })
}

export async function publishSessionReset(roomId: string, sessionStartUnix: number) {
  if (!client.connected) {
    console.warn('[MQTT] Client not ready to publish')
    return
  }

  const topic = `attendance/${roomId}/reset`

  const payload = create(SessionResetSchema, {
    roomId: roomId,
    sessionStart: BigInt(sessionStartUnix),
  })

  const buffer = toBinary(SessionResetSchema, payload)

  client.publish(topic, buffer as Buffer, { qos: 1 }, (error) => {
    if (error) {
      console.error(`[MQTT] Publish error on ${topic}:`, error)
    } else {
      console.log(`[MQTT] Published SessionReset to ${topic}`)
    }
  })
}
