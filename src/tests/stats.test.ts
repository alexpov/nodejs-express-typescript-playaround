import request from 'supertest';
import App from '../app';
import StatsRoute from '../routes/stats.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing stats route', () => {
  describe('[GET] /api/v1/stats', () => {
    it('empty response', () => {
      const statsRoute = new StatsRoute();
      const app = new App([statsRoute]);

      return request(app.getServer()).get(`${statsRoute.path}`).expect({ totalWords: 0, totalRequests: 0, avgProcessingTimeNs: 0 });
    });

    it('set total words', () => {
      const statsRoute = new StatsRoute();
      let { statsController } = statsRoute;
      const app = new App([statsRoute]);

      const count = 10;
      statsController.setTotalWords(count);
      return request(app.getServer()).get(`${statsRoute.path}`).expect({ totalWords: count, totalRequests: 0, avgProcessingTimeNs: 0 });
    });

    it('add request', () => {
      const statsRoute = new StatsRoute();
      let { statsController } = statsRoute;
      const app = new App([statsRoute]);

      let reqs = [10, 20, 30, 40];
      for (var val of reqs) {
        statsController.addRequest(val);
      };
      
      return request(app.getServer()).get(`${statsRoute.path}`).expect(
        {
          totalWords: 0,
          totalRequests: reqs.length,
          avgProcessingTimeNs: reqs.reduce((a, v, i) => (a * i + v) / (i + 1))
        });
    });
  });
});
