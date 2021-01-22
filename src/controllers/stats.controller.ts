import { NextFunction, Request, Response } from 'express';

class StatsController {
  private _metrics = {
    totalWords: 0,
    totalRequests: 0,
    avgProcessingTimeNs: 0,
  };

  public setTotalWords(totalWords: number) {
    this._metrics.totalWords = totalWords;
  }

  public addRequest(processingTimeNs: number) {
    let { _metrics } = this;

    let totalProcessingTimeNs = _metrics.totalRequests * _metrics.avgProcessingTimeNs;

    _metrics.totalRequests += 1;
    _metrics.avgProcessingTimeNs = (totalProcessingTimeNs + processingTimeNs) / _metrics.totalRequests;
  }

  public stats = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json(this._metrics);
    } catch (error) {
      next(error);
    }
  };
}

export default StatsController;
