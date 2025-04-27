import { Request, Response } from 'express';
import { AppealService } from '../../services/appeal/appealService.js';

export class AppealController {
  private service: AppealService;

  constructor() {
    this.service = new AppealService();
  }

  async createAppeal(req: Request, res: Response) {
    try {
      const result = await this.service.createAppeal(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create appeal' });
    }
  }

  async startAppeal(req: Request, res: Response) {
    try {
      const result = await this.service.startAppeal(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to start appeal' });
    }
  }

  async completeAppeal(req: Request, res: Response) {
    try {
      const result = await this.service.completeAppeal(req.params.id, req.body.resolution);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to complete appeal' });
    }
  }

  async cancelAppeal(req: Request, res: Response) {
    try {
      const result = await this.service.cancelAppeal(req.params.id, req.body.cancellationReason);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel appeal' });
    }
  }

  async getAppeals(req: Request, res: Response) {
    try {
      const filters = req.query;
      const result = await this.service.getAppeals(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appeals' });
    }
  }

  async cancelAllInProgress(req: Request, res: Response) {
    try {
      const result = await this.service.cancelAllInProgress();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel all appeals' });
    }
  }
}