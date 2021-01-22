import request from 'supertest';
import App from '../app';
import SimilarRoute from '../routes/similar.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing similar route', () => {
  describe('[GET] /api/v1/similar', () => {
    it('empty response', () => {
      const similarRoute = new SimilarRoute();
      const app = new App([similarRoute]);

      const word = 'myword';
      return request(app.getServer())
        .get(`${similarRoute.path}?word=${word}`)
        .expect({ [word]: [] });
    });
  });
});
