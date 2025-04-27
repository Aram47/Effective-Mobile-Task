import { Kafka, Producer } from 'kafkajs';
import { logger } from '../../../shared/utils/logger.js';

export class KafkaProducer {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS!] });
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    logger.info('Kafka producer connected');
  }

  async send(topic: string, message: any, correlationId?: string) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify({ ...message, correlationId }) }],
    });
    logger.info(`Message sent to ${topic}: ${JSON.stringify(message)}`);
  }

  async disconnect() {
    await this.producer.disconnect();
    logger.info('Kafka producer disconnected');
  }
}