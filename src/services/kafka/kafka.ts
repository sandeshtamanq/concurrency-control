import { Kafka } from 'kafkajs'
// import { logger } from '../utils/logger'

export const kafka = new Kafka({
  brokers: ['192.168.1.66:9092'],
  clientId: 'ticket-booking-app',
})

const admin = kafka.admin()

async function createTopic() {
  await admin.connect()

  const topics = await admin.listTopics()

  if (topics.includes('ticket-booking')) {
    console.log('Topic already exists')
    await admin.disconnect()
    return
  }

  try {
    await admin.createTopics({
      topics: [
        {
          topic: 'ticket-booking',
          numPartitions: 2,
          replicationFactor: 1,
        },
      ],
    })
    console.log('Topic created successfully')
  } catch (error) {
    console.error('Topic creation failed:', error)
  }
  await admin.disconnect()
}

createTopic()
