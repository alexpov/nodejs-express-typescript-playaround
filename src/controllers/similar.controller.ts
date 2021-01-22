import { NextFunction, Request, Response } from 'express';

class StatsController {
  public similar = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { word } = req.query;
      res.json({ [word as string]: [] });
    } catch (error) {
      next(error);
    }
  };
}

export default StatsController;
