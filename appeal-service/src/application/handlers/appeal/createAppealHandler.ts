// import { AppealEntity, AppealStatus } from '../../../domain/appeal/entities/appeal.js';
// import { AppealRepository } from '../../../domain/appeal/repositories/appealRepository.js';
// import { v4 as uuidv4 } from 'uuid';

// export class AppealHandler {
//   constructor(private appealRepository: AppealRepository) {}

//   async handleCreate(payload: { topic: string; text: string }) {
//     const appeal = await this.appealRepository.create({
//       id: uuidv4(),
//       topic: payload.topic,
//       text: payload.text,
//       status: AppealStatus.NEW,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     return appeal;
//   }

//   async handleAssign(payload: { id: string }) {
//     const appeal = await this.appealRepository.findById(payload.id);
//     if (!appeal) throw new Error('Appeal not found');
//     const appealEntity = new AppealEntity(appeal);
//     appealEntity.assign();
//     await this.appealRepository.update(appealEntity.getData());
//     return appealEntity.getData();
//   }

//   async handleComplete(payload: { id: string; resolution: string }) {
//     const appeal = await this.appealRepository.findById(payload.id);
//     if (!appeal) throw new Error('Appeal not found');
//     const appealEntity = new AppealEntity(appeal);
//     appealEntity.complete(payload.resolution);
//     await this.appealRepository.update(appealEntity.getData());
//     return appealEntity.getData();
//   }

//   async handleCancel(payload: { id: string; reason: string }) {
//     const appeal = await this.appealRepository.findById(payload.id);
//     if (!appeal) throw new Error('Appeal not found');
//     const appealEntity = new AppealEntity(appeal);
//     appealEntity.cancel(payload.reason);
//     await this.appealRepository.update(appealEntity.getData());
//     return appealEntity.getData();
//   }

//   async handleList(payload: { date?: string; startDate?: string; endDate?: string }) {
//     if (payload.date) {
//       return this.appealRepository.findByDate(payload.date);
//     }
//     return this.appealRepository.findByDateRange(payload.startDate, payload.endDate);
//   }

//   async handleCancelAllInProgress() {
//     const appeals = await this.appealRepository.findAllInProgress();
//     for (const appeal of appeals) {
//       const appealEntity = new AppealEntity(appeal);
//       appealEntity.cancel('Cancelled by system');
//       await this.appealRepository.update(appealEntity.getData());
//     }
//     return appeals;
//   }
// }

import { Appeal } from '../../../domain/appeal/entities/appeal.js';
import { IAppealRepository } from '../../../domain/appeal/repositories/iappealRepository.js';
import { CreateAppealCommand } from '../../commands/appeal/createAppealCommand.js';
import { KafkaProducer } from '../../../infrastructure/messaging/kafka/kafkaProducer.js';
import { logger } from '../../../shared/utils/logger.js';

export class CreateAppealHandler {
  constructor(
    private appealRepository: IAppealRepository,
    private kafkaProducer: KafkaProducer
  ) {}

  async handle(command: CreateAppealCommand): Promise<void> {
    logger.info(`Handling CreateAppealCommand: ${JSON.stringify(command)}`);
    const appeal = new Appeal(command.subject, command.text);
    await this.appealRepository.save(appeal);
    logger.info(`Appeal created: ${appeal.getId()}`);

    // Отправляем ответ в appeal-responses
    await this.kafkaProducer.send('appeal-responses', {
      data: {
        id: appeal.getId(),
        subject: appeal.getSubject(),
        text: appeal.getText(),
        status: appeal.getStatus(),
      },
    }, command.correlationId);
  }
}