// import { initDatabase } from './infrastructure/database';
// import { AppealRepositoryImpl } from './domain/appeal/repositories/iappealRepository.js';
// import { AppealHandler } from './application/handlers/appeal/createAppealHandler.js';
// import { KafkaConsumer } from './infrastructure/messaging/kafka/kafkaConsumer.js';

// async function start() {
//   const sequelize = initDatabase();
//   await sequelize.sync({ force: true });

//   const appealRepository = new AppealRepositoryImpl();
//   const appealHandler = new AppealHandler(appealRepository);
//   const kafkaConsumer = new KafkaConsumer(appealHandler);

//   await kafkaConsumer.start();
//   console.log('Appeal Service running');
// }

// start().catch(console.error);

import { startAppealService } from './app.js';
import { logger } from './shared/utils/logger.js';

startAppealService().catch((error) => {
  logger.error('Failed to start Appeal Service:', error);
  process.exit(1);
});