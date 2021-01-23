import { NextFunction, Request, Response } from 'express';
import StatsService from '../services/stats.service';

class StatsController {
  public stats = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json(StatsService.getInstance().getStats());
    } catch (error) {
      next(error);
    }
  };
}

export default StatsController;
