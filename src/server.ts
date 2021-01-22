import 'dotenv/config';
import App from './app';
import StatsRoute from './routes/stats.route';
import UsersRoute from './routes/users.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new StatsRoute(), new UsersRoute()]);

app.listen();
