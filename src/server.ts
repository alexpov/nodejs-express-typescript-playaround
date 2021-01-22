import 'dotenv/config';
import App from './app';
import StatsRoute from './routes/stats.route';
import SimilarRoute from './routes/similar.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new StatsRoute(), new SimilarRoute()]);

app.listen();
