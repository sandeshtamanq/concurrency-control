const consumer = new KafkaConsumer({
  brokers: ['localhost:9092'],
  groupId: 'test-group',
  topics: ['test-topic'],
  onMessage: async (message) => {
    console.log(message.value.toString())
  },
})
