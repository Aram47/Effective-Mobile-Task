import { App } from './app.js';
import { AppealService } from './services/appeal/appealService.js';
import { KafkaAdmin } from './config/kafka.js';
import { Kafka } from 'kafkajs';

async function waitForKafka(brokers: string[], maxRetries = 10, retryDelay = 2000): Promise<void> {
  const kafka = new Kafka({ brokers });
  const admin = kafka.admin();
  for (let i = 0; i < maxRetries; i++) {
    try {
      await admin.connect();
      await admin.disconnect();
      console.log('Kafka is ready');
      return;
    } catch (error) {
      console.log(`Kafka not ready, retrying (${i + 1}/${maxRetries})...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw new Error('Failed to connect to Kafka after retries');
}

async function startServer() {
  const app = new App().app;
  const appealService = new AppealService();
  const kafkaAdmin = new KafkaAdmin();

  try {
    await waitForKafka([process.env.KAFKA_BROKERS!])
    // Подключаемся к Kafka Admin и создаем темы
    await kafkaAdmin.connect();
    await kafkaAdmin.createTopics([
      { topic: 'appeal-commands', numPartitions: 1, replicationFactor: 1 },
      { topic: 'appeal-responses', numPartitions: 1, replicationFactor: 1 },
    ]);
    await kafkaAdmin.disconnect();

    // Инициализируем AppealService и запускаем сервер
    await appealService.initialize();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await appealService.shutdown();
    await kafkaAdmin.disconnect();
    process.exit(1);
  }

  process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    await appealService.shutdown();
    await kafkaAdmin.disconnect();
    process.exit(0);
  });
}

startServer();