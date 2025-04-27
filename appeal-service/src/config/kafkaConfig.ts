export const kafkaConfig = {
  brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
};