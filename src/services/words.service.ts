class WordsService {
  public wordsDict = null;

  public async addWord(word: string): Promise<void> {
    throw new Error('not implemented');
    return;
  }

  public async getSimilarWords(word: string): Promise<String[]> {
    return [];
  }
}

export default WordsService;
