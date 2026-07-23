import { create, type DescMessage, type MessageInitShape, toBinary } from '@bufbuild/protobuf'
import { AttendanceSuccessSchema, SessionEndSchema, SessionStartSchema } from '@server/protobuf/message_pb'
import mqtt from 'mqtt'

// Connect to HiveMQ public broker (as used in the ESP32 code)
const client = mqtt.connect('mqtt://localhost:1883')

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

const publish = async <Schema extends DescMessage>(
  topic: string,
  payload: MessageInitShape<Schema>,
  schema: Schema,
) => {
  if (!client.connected) {
    console.warn('[MQTT] Client not ready to publish')
    return
  }

  const schemaPayload = create(schema, payload)
  const buffer = toBinary(schema, schemaPayload)

  try {
    await client.publishAsync(topic, buffer as Buffer, { qos: 1 })
    console.log(`[MQTT] Published to ${topic}`)
  } catch (error) {
    console.error(`[MQTT] Publish error on ${topic}:`, error)
  }
}

export const publishAttendanceSuccess = async (roomId: string, studentId: string, studentName: string, timestamp: Date) => {
  return publish(
    `classroom/${roomId}/attendance`,
    {
      studentId,
      studentName,
      timestamp: BigInt(timestamp.getTime()),
    },
    AttendanceSuccessSchema,
  )
}

export const publishSessionStart = async (roomId: string, sessionStartTime: Date) => {
  return publish(
    `classroom/${roomId}/start-session`,
    {
      sessionStart: BigInt(sessionStartTime.getTime()),
    },
    SessionStartSchema,
  )
}

export const publishSessionEnd = async (roomId: string) => {
  return publish(`classroom/${roomId}/end-session`, {}, SessionEndSchema)
}
