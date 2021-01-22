import { Router } from 'express';
import StatsController from '../controllers/stats.controller';
import Route from '../interfaces/routes.interface';

class StatsRoute implements Route {
  public path = '/api/v1/stats';
  public router = Router();
  public statsController = new StatsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.statsController.stats);
  }
}

export default StatsRoute;
