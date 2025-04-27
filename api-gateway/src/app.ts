import express, { Application } from 'express';
import cors from 'cors';
import configEnv from './config/env.js';
import appealRoutes from './routes/appeal/appealRoute.js';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
  }

  private configure(): void {
    configEnv();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use('/api/appeals', appealRoutes);
  }
}