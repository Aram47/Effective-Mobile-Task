import { v4 as uuidv4 } from 'uuid';
import { KafkaProducer, KafkaConsumer } from '../../config/kafka.js';
import { CreateAppealDto } from '../../dto/appeal/create-appeal.dto.js';
import { UpdateAppealDto } from '../../dto/appeal/update-appeal.dto.js';

export class AppealService {
  private producer: KafkaProducer;
  private consumer: KafkaConsumer;
  private responseCallbacks: Map<string, (data: any) => void>;

  constructor() {
    this.producer = new KafkaProducer();
    this.consumer = new KafkaConsumer('api-gateway-group');
    this.responseCallbacks = new Map();
  }

  async initialize() {
    await this.producer.connect();
    await this.consumer.subscribe('appeal-responses', (message) => {
      const callback = this.responseCallbacks.get(message.correlationId);
      if (callback) {
        callback(message.data);
        this.responseCallbacks.delete(message.correlationId);
      }
    });
  }

  private async sendCommandAndWaitResponse<T>(topic: string, message: any): Promise<T> {
    const correlationId = uuidv4();
    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.responseCallbacks.delete(correlationId);
        reject(new Error('Timeout waiting for response'));
      }, 5000); // Таймаут 5 секунд

      this.responseCallbacks.set(correlationId, (data) => {
        clearTimeout(timeout);
        resolve(data);
      });

      this.producer.send(topic, message, correlationId).catch(reject);
    });
  }

  async createAppeal(dto: CreateAppealDto) {
    return this.sendCommandAndWaitResponse('appeal-commands', {
      action: 'create',
      data: dto,
    });
  }

  async startAppeal(id: string) {
    return this.sendCommandAndWaitResponse('appeal-commands', {
      action: 'start',
      data: { id },
    });
  }

  async completeAppeal(id: string, resolution: string) {
    return this.sendCommandAndWaitResponse('appeal-commands', {
      action: 'complete',
      data: { id, resolution },
    });
  }

  async cancelAppeal(id: string, cancellationReason: string) {
    return this.sendCommandAndWaitResponse('appeal-commands', {
      action: 'cancel',
      data: { id, cancellationReason },
    });
  }

  async getAppeals(filters: { date?: string; startDate?: string; endDate?: string }) {
    return this.sendCommandAndWaitResponse('appeal-commands', {
      action: 'get',
      data: filters,
    });
  }

  async cancelAllInProgress() {
    await this.producer.send('appeal-commands', {
      action: 'cancel-all',
      data: {},
    });
    return { message: 'All in-progress appeals cancelled' };
  }

  async shutdown() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}