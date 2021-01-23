import { NextFunction, Request, Response } from 'express';
import SimilarWordsService from '../services/similar-words.service';
import StatsService from '../services/stats.service';

class SimilarController {
  private _similarWordsService = null;

  constructor() {
    this._similarWordsService = new SimilarWordsService();
    StatsService.getInstance().setTotalWords(this._similarWordsService.getNumWords());
  }

  public similar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { word } = req.query;
      const similar = await this._similarWordsService.getSimilarWords(word as string);
      console.debug(`similar words for '${word}' -> '${JSON.stringify(similar)}'`);
      res.json({ [word as string]: similar });
      StatsService.getInstance().addRequest(1);
    } catch (error) {
      next(error);
    }
  };
}

export default SimilarController;
