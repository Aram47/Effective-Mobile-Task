import { Kafka, Consumer } from 'kafkajs';
import { AppealHandler } from '../../application/handlers/appealHandler.js';

export class KafkaConsumer {
  private consumer: Consumer;

  constructor(private appealHandler: AppealHandler) {
    const kafka = new Kafka({
      clientId: 'appeal-service',
      brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
    });
    this.consumer = kafka.consumer({ groupId: 'appeal-group' });
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'appeal-events', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value!.toString());
        switch (event.type) {
          case 'CREATE':
            await this.appealHandler.handleCreate(event.payload);
            break;
          case 'ASSIGN':
            await this.appealHandler.handleAssign(event.payload);
            break;
          case 'COMPLETE':
            await this.appealHandler.handleComplete(event.payload);
            break;
          case 'CANCEL':
            await this.appealHandler.handleCancel(event.payload);
            break;
          case 'LIST':
            await this.appealHandler.handleList(event.payload);
            break;
          case 'CANCEL_ALL_IN_PROGRESS':
            await this.appealHandler.handleCancelAllInProgress();
            break;
        }
      },
    });
  }
}