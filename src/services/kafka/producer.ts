import { logger } from '../../utils/logger'
import { kafka } from './kafka'

export const producer = kafka.producer()

export const produceMessage = async (message: { [key: string]: string }) => {
  logger.info('connecting producer...')
  await producer.connect()
  logger.info('producer connected...')

  await producer.send({
    topic: 'ticket-booking',

    messages: [
      { partition: 0, key: 'lock-update', value: JSON.stringify(message) },
    ],
  })

  await producer.disconnect()
}
