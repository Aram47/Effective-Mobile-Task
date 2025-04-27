import { Request, Response, NextFunction } from 'express';
import { validateCreateAppealDto } from '../../dto/appeal/create-appeal.dto.js';
import { validateUpdateAppealDto } from '../../dto/appeal/update-appeal.dto.js';

export function validateCreateAppeal(req: Request, res: Response, next: NextFunction) {
  const errors = validateCreateAppealDto(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export function validateUpdateAppeal(action: 'complete' | 'cancel') {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validateUpdateAppealDto(req.body, action);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    next();
  };
};