import { logger } from '../utils/logger';
import { sortStrAlphabet } from '../utils/util';
import * as fs from 'fs';
import * as path from 'path';

/**
 * NOTE regarding the existing implementation:
 *
 * This service has 2 different implementations, First relies on Trie data structures (SimilarWordsServiceTrie).
 * Second relies on HasMap data structure (SimilarWordsServiceMap).
 *
 * In general, for both memory and lookup performance, there are better options out there to consider, for example TSTs.
 * However, all are effected by the dictionary input and look patterns
 *
 * In general, pros and cons of Trie vs the Map in the provided implementations
 * - Memory: 
 *    Trie might provides better memory consumption since it re-uses common words prefix but its very dependant on the input words.
 *    On the contrary, using trie might allocate more pages in memory since its data less packed (keys stored not in continuous manner)
 *    Hence it might be memory intensive
 *
 * - Lookup performance: 
 *    In general, both options are O(k), when k is the length of the lookup word.
 *
 *    For lookup pattern that faivors existing words lookup (like on our 'english dicitionary words case'),
 *    HashMap will utilize CPU cache line better compared to the Trie since the lookup word will be continuous
 *    memory, hence (most likelly) the lookup operations will done based on CPU l1,L2,L3 caches which a magnitute faster
 *    vs memory access. For more info read cold/hot memroy and CPU cache lines
 *
 *    For lookup patterns that faivor non-existing words lookup, Trie might provide better performance since its check letter
 *    by letter, meaning, ithas a high chance of stopping the search before reading the whole input string
 *
 * Current case is 'english dicitionary words case', hence, most likelly, lookup will result inexisting words + currently favoring lookup
 * performance over memory consumption hence using the Map based implementation as default
 *
 * To improve memory usage, can consider compressing the dictionary words, however it will effect lookup performance and for some input types
 * might not be relevant
 */

const initWordsDict = (service: any) => {
  if (process.env.DICTIONARY_FILE_NAME === undefined) {
    // TODO this should be handled by mocks in test env
    return;
  }

  logger.info(`Initializing words dictionary, using file ${process.env.DICTIONARY_FILE_NAME}`);
  const dictPath = path.join(__dirname, '..', '..', process.env.DICTIONARY_FILE_NAME);
  const words = fs.readFileSync(dictPath).toString().replace(/\r\n/g, '\n').split('\n');
  for (const w of words) {
    service.addWord(w);
  }
  logger.info(`Initializing dictionary done`);
};
class TrieNode {
  /**
   * Trie node letter (key)
   */
  public letter: string = null;

  /**
   * Map between letter to next trie node
   */
  public children: Map<string, TrieNode> = null;

  /**
   * Set of words assciated with the trie node.
   */
  public words: string[] = null;

  constructor(letter: string) {
    this.letter = letter;
    this.children = new Map<string, TrieNode>();
    this.words = [];
  }
}

class Trie {
  private _root: TrieNode;
  private _numWords: number;

  constructor() {
    this._root = new TrieNode('');
    this._numWords = 0;
  }

  /**
   * Get number of distinct words stored in the trie
   */
  public size(): number {
    return this._numWords;
  }

  /**
   * Add word to a trie
   */
  public add(word: string) {
    let curNode = this._root;
    const keyWord = sortStrAlphabet(word);

    for (let i = 0; i < keyWord.length; i++) {
      const curChar = keyWord[i];

      if (!curNode.children.has(curChar)) {
        curNode.children.set(curChar, new TrieNode(curChar));
      }
      curNode = curNode.children.get(curChar);
    }

    if (!curNode.words.includes(word)) {
      curNode.words.push(word);
      this._numWords += 1;
      logger.debug(`word added: ${keyWord} -> ${word}`);
    } else {
      logger.debug(`duplicate word skipped: word=${word}`);
    }
  }

  /**
   * Get similar words
   */
  public get(word: string): string[] {
    let curNode = this._root;
    const keyWord = sortStrAlphabet(word);

    for (let i = 0; i < keyWord.length; i++) {
      const curChar = keyWord[i];
      if (!curNode.children.has(curChar)) {
        return [];
      }
      curNode = curNode.children.get(curChar);
    }

    return curNode.words.filter(w => w !== word);
  }
}
class SimilarWordsServiceTrie {
  private _wordsDict: Trie = null;

  constructor() {
    this._wordsDict = new Trie();
    initWordsDict(this);
    logger.info(`Initializing dictionary done, total number of added distinct words ${this.getNumWords()}`);
  }

  /**
   * Get number of destinct words in the dictionary
   */
  public getNumWords(): number {
    return this._wordsDict.size();
  }

  /**
   * Add word to a similar words dictionary
   */
  public async addWord(word: string): Promise<void> {
    this._wordsDict.add(word);
  }

  /**
   * Get similar words
   */
  public async getSimilarWords(word: string): Promise<string[]> {
    return this._wordsDict.get(word);
  }
}

class SimilarWordsServiceMap {
  private _wordsDict: Map<string, string[]> = null;
  private _wordsCount: number = 0;

  constructor() {
    this._wordsDict = new Map<string, string[]>();
    initWordsDict(this);
    logger.info(`Initializing dictionary done, total number of added distinct words ${this.getNumWords()}`);
  }

  public getNumWords(): number {
    return this._wordsCount;
  }

  public async addWord(word: string): Promise<void> {
    const keyWord = sortStrAlphabet(word);
    if (this._wordsDict.has(keyWord)) {
      let arr = this._wordsDict.get(keyWord);
      if (!arr.includes(word)) {
        arr.push(word);
        this._wordsCount += 1;
      }
    } else {
      this._wordsDict.set(keyWord, [word]);
      this._wordsCount += 1;
    }
  }

  public async getSimilarWords(word: string): Promise<string[]> {
    const keyWord = sortStrAlphabet(word);
    const res = this._wordsDict.get(keyWord) || [];
    return res.filter(w => w !== word);
  }
}

export default SimilarWordsServiceMap;
