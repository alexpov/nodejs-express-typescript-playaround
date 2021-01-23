import 'dotenv/config';
import App from './app';
import StatsRoute from './routes/stats.route';
import SimilarRoute from './routes/similar.route';
import validateEnv from './utils/validateEnv';
import { logger } from './utils/logger';

validateEnv();

process.on('uncaughtException', function (e) {
  logger.error('Ouch, an unhandled exception');
  logger.error(e instanceof Error ? e.message : e);
  process.exit(1);
});

const app = new App([new StatsRoute(), new SimilarRoute()]);

app.listen();
