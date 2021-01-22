import WordsService from '../services/words.service';

describe('Testing words service', () => {
  describe('Get similar words', () => {
    it('empty response', async () => {
      const wordsService = new WordsService();
      const word = 'myword';
      const res = await wordsService.getSimilarWords(word);
      expect(res).toStrictEqual([]);
    });
  });
});
