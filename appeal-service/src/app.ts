import { KafkaConsumer } from './infrastructure/messaging/kafka/kafkaConsumer.js';
import { KafkaProducer } from './infrastructure/messaging/kafka/kafkaProducer.js';
import { AppealApplicationService } from './application/services/appeal/appealApplicationService.js';
import { CreateAppealHandler } from './application/handlers/appeal/createAppealHandler.js';
import { AppealRepositoryPostgre } from './infrastructure/database/repositories/appeal/appealRepositoryPostgre.js';
import { logger } from './shared/utils/logger.js';
import { Kafka } from 'kafkajs';

async function waitForKafka(brokers: string[], maxRetries = 10, retryDelay = 2000): Promise<void> {
  const kafka = new Kafka({ brokers });
  const admin = kafka.admin();
  for (let i = 0; i < maxRetries; i++) {
    try {
      await admin.connect();
      await admin.disconnect();
      logger.info('Kafka is ready');
      return;
    } catch (error) {
      logger.info(`Kafka not ready, retrying (${i + 1}/${maxRetries})...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw new Error('Failed to connect to Kafka after retries');
}

export async function startAppealService() {
  // Ждем готовности Kafka
  await waitForKafka([process.env.KAFKA_BROKERS || 'kafka:9092']);

  const kafkaProducer = new KafkaProducer();
  const appealRepository = new AppealRepositoryPostgre();
  const createAppealHandler = new CreateAppealHandler(appealRepository, kafkaProducer);
  const appealApplicationService = new AppealApplicationService(createAppealHandler);

  await kafkaProducer.connect();

  const consumer = new KafkaConsumer('appeal-service-group');
  await consumer.subscribe('appeal-commands', async (message) => {
    logger.info(`Received message: ${JSON.stringify(message)}`);
    if (message.action === 'create') {
      await appealApplicationService.createAppeal(
        message.data.subject,
        message.data.text,
        message.correlationId
      );
    }
  });

  logger.info('Appeal Service started');
}