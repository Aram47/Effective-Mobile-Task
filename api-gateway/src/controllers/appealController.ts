import { Request, Response } from "express";
import AppealService from "../services/appealService.js";

export default class AppealController {
  constructor(private readonly appealService: AppealService) {}

  createAppeal(req: Request, res: Response): void {
    this.appealService.createAppeal(req);
    res.status(201).json({ message: 'Appeal created' });
  }

  assignAppeal(req: Request, res: Response): void {
    this.appealService.assignAppeal(req);
    res.json({ message: 'Appeal assigned' });
  }

  completeAppeal(req: Request, res: Response): void {
    this.appealService.completeAppeal(req);
    res.json({ message: 'Appeal completed' });
  }

  cancelAppeal(req: Request, res: Response): void {
    this.appealService.cancelAppeal(req);
    res.json({ message: 'Appeal cancelled' });
  }

  getAppeals(req: Request, res: Response): void {
    this.appealService.getAppeals(req);
    res.json({ message: 'Appeal list requested' });
  }

  cancelAllInProgress(req: Request, res: Response): void {
    this.appealService.cancelAllInProgress();
    res.json({ message: 'All in-progress appeals cancelled' });
  }
}