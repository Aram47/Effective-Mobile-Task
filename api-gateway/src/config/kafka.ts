import { Kafka, Producer } from 'kafkajs';

function configKafka() {
  const kafka = new Kafka({
    clientId: 'api-gateway',
    brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
  });
  
  return kafka.producer();
}

const producer: Producer = configKafka();

export default producer;