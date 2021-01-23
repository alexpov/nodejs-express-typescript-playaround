import { NextFunction, Request, Response } from 'express';
import SimilarWordsService from '../services/similar-words.service';

class SimilarController {
  private _similarWordsService = new SimilarWordsService();

  public similar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { word } = req.query;
      const similar = await this._similarWordsService.getSimilarWords(word as string);
      console.debug(`similar words for '${word}' -> '${JSON.stringify(similar)}'`);;
      res.json({ [word as string]: similar });
    } catch (error) {
      next(error);
    }
  };
}

export default SimilarController;
