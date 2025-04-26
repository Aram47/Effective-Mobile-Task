import { initDatabase } from './infrastructure/database';
import { AppealRepositoryImpl } from './domain/repositories/appealRepository.js';
import { AppealHandler } from './application/handlers/appealHandler.js';
import { KafkaConsumer } from './infrastructure/kafka/consumer.js';

async function start() {
  const sequelize = initDatabase();
  await sequelize.sync({ force: true });

  const appealRepository = new AppealRepositoryImpl();
  const appealHandler = new AppealHandler(appealRepository);
  const kafkaConsumer = new KafkaConsumer(appealHandler);

  await kafkaConsumer.start();
  console.log('Appeal Service running');
}

start().catch(console.error);