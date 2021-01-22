import { Router } from 'express';
import SimilarController from '../controllers/similar.controller';
import Route from '../interfaces/routes.interface';

class SimilarRoute implements Route {
  public path = '/api/v1/similar';
  public router = Router();
  public similarController = new SimilarController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.similarController.similar);
  }
}

export default SimilarRoute;
