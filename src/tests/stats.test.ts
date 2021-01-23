import request from 'supertest';
import App from '../app';
import StatsRoute from '../routes/stats.route';
import StatsService from '../services/stats.service';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing stats route', () => {
  describe('[GET] /api/v1/stats', () => {
    it('empty response', () => {
      StatsService.getInstance().reset();

      const statsRoute = new StatsRoute();
      const app = new App([statsRoute]);

      return request(app.getServer()).get(`${statsRoute.path}`).expect({ totalWords: 0, totalRequests: 0, avgProcessingTimeNs: 0 });
    });

    it('set total words', () => {
      StatsService.getInstance().reset();

      const statsRoute = new StatsRoute();
      const { statsController } = statsRoute;
      const app = new App([statsRoute]);

      const count = 10;
      StatsService.getInstance().setTotalWords(count);
      return request(app.getServer()).get(`${statsRoute.path}`).expect({ totalWords: count, totalRequests: 0, avgProcessingTimeNs: 0 });
    });

    it('add request', () => {
      StatsService.getInstance().reset();

      const statsRoute = new StatsRoute();
      const { statsController } = statsRoute;
      const app = new App([statsRoute]);

      const reqs = [10, 20, 30, 40];
      for (const val of reqs) {
        StatsService.getInstance().addRequest(val);
      }

      return request(app.getServer())
        .get(`${statsRoute.path}`)
        .expect({
          totalWords: 0,
          totalRequests: reqs.length,
          avgProcessingTimeNs: reqs.reduce((a, v, i) => (a * i + v) / (i + 1)),
        });
    });
  });
});
