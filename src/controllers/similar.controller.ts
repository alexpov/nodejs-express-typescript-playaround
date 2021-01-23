import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import SimilarWordsService from '../services/similar-words.service';
import StatsService from '../services/stats.service';
import { isValid } from '../utils/util';

class SimilarController {
  private _similarWordsService = null;

  constructor() {
    this._similarWordsService = new SimilarWordsService();
    StatsService.getInstance().setTotalWords(this._similarWordsService.getNumWords());
  }

  public similar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { word } = req.query;
      if (!isValid(word)) {
        throw new HttpException(400, "Must provide 'word' query paramter");
      }

      // TODO: consider to do it on middleware level
      const start = process.hrtime();

      const similar = await this._similarWordsService.getSimilarWords(word as string);
      res.json({ [word as string]: similar });

      const diff = process.hrtime(start);

      StatsService.getInstance().addRequest(diff);
    } catch (error) {
      next(error);
    }
  };
}

export default SimilarController;
