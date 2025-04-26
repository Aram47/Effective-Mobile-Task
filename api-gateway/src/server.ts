import express from 'express';
import cors from 'cors';
import appealRouter from './routes/appealRoute.js';
import producer from './config/kafka.js';
import configEnv from './config/env.js';

async function start(): Promise<void> {
  configEnv();
  await producer.connect();
  const port: number = Number(process.env.PORT);

  const app = express();
  app.use(express.json());
  app.use(cors());
  
  app.use('/appeals', appealRouter);

  app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
  });
}

start().catch(console.error);