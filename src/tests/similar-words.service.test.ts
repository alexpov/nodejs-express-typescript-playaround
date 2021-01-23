import SimilarWordsService from '../services/similar-words.service';

describe('Testing words service', () => {
  describe('Get similar words', () => {
    it('empty response', async () => {
      const wordsService = new SimilarWordsService();
      const word = 'myword';
      let res = await wordsService.getSimilarWords(word);
      expect(res).toStrictEqual([]);

      await wordsService.addWord(word);
      res = await wordsService.getSimilarWords(word + 'a');
      expect(res).toStrictEqual([]);
    });

    it('similar words basic', async () => {
      const wordsService = new SimilarWordsService();

      const adds = [];
      for (const w of ['owrd', 'drow']) {
        adds.push(wordsService.addWord(w));
      }

      await Promise.all(adds);
      const res = await wordsService.getSimilarWords('word');
      expect(res).toStrictEqual(['owrd', 'drow']);
    });

    it('similar words skipped input word', async () => {
      const wordsService = new SimilarWordsService();

      const adds = [];
      for (const w of ['word', 'drow']) {
        adds.push(wordsService.addWord(w));
      }

      await Promise.all(adds);
      const res = await wordsService.getSimilarWords('word');
      expect(res).toStrictEqual(['drow']);
    });

    it('similar words including sub words, empty results', async () => {
      const wordsService = new SimilarWordsService();

      const adds = [];
      const words = ['a', 'aa', 'aaa'];
      for (const w of words) {
        adds.push(wordsService.addWord(w));
      }

      await Promise.all(adds);

      for (const w of words) {
        const res = await wordsService.getSimilarWords(w);
        // word in the query should not be returned
        expect(res).toStrictEqual([]);
      }
    });

    it('similar words including sub words', async () => {
      const wordsService = new SimilarWordsService();

      const adds = [];
      const words = ['ab', 'abab', 'baba', 'ba'];
      for (const w of words) {
        adds.push(wordsService.addWord(w));
      }

      await Promise.all(adds);

      let res = await wordsService.getSimilarWords('ab');
      expect(res).toStrictEqual(['ba']);
      res = await wordsService.getSimilarWords('baba');
      expect(res).toStrictEqual(['abab']);
    });
  });

  describe('Get words count', () => {
    it('with duplicates', async () => {
      const wordsService = new SimilarWordsService();

      const adds = [];
      for (const w of ['word', 'drow', 'word', 'drow', 'bonus']) {
        adds.push(wordsService.addWord(w));
      }

      await Promise.all(adds);
      expect(wordsService.getNumWords()).toStrictEqual(3);
    });

    it('without duplicates', async () => {
      const wordsService = new SimilarWordsService();

      const adds = [];
      for (const w of ['word', 'drow', 'bonus', 'apple', 'eppla']) {
        adds.push(wordsService.addWord(w));
      }

      await Promise.all(adds);
      expect(wordsService.getNumWords()).toStrictEqual(5);
    });
  });
});
