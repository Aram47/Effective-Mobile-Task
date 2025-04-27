import { Kafka, Producer, Consumer, Admin } from 'kafkajs';

export class KafkaProducer {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS!] });
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async send(topic: string, message: any, correlationId?: string) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify({ ...message, correlationId }) }],
    });
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}

export class KafkaConsumer {
  private consumer: Consumer;
  private callbacks: Map<string, (message: any) => void>;

  constructor(groupId: string) {
    const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS!] });
    this.consumer = kafka.consumer({ groupId });
    this.callbacks = new Map();
  }

  async subscribe(topic: string, callback: (message: any) => void) {
    if (!this.callbacks.has(topic)) {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const parsed = JSON.parse(message.value!.toString());
          const cb = this.callbacks.get(topic);
          if (cb) cb(parsed);
        },
      });
      this.callbacks.set(topic, callback);
    } else {
      this.callbacks.set(topic, callback); // Обновляем callback, если уже подписаны
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
    this.callbacks.clear();
  }
}

export class KafkaAdmin {
  private admin: Admin;

  constructor() {
    const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS!] });
    this.admin = kafka.admin();
  }

  async connect() {
    await this.admin.connect();
  }

  async createTopics(topics: { topic: string; numPartitions: number; replicationFactor: number }[]) {
    try {
      const existingTopics = await this.admin.listTopics();
      const topicsToCreate = topics.filter((t) => !existingTopics.includes(t.topic));

      if (topicsToCreate.length === 0) {
        console.log('All topics already exist');
        return;
      }

      await this.admin.createTopics({
        topics: topicsToCreate,
      });
      console.log('Topics created:', topicsToCreate.map((t) => t.topic));
    } catch (error) {
      console.error('Failed to create topics:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.admin.disconnect();
  }
}