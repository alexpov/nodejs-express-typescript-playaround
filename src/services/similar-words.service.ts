import { logger } from '../utils/logger';
import { sortStrAlphabet } from '../utils/util';
import * as fs from 'fs';
import * as path from 'path';

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
  public letter: string = null;
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
    const keyWord = sortStrAlphabet(word); // o(klogk) dict fixed size thus sorting can be -> o(k)

    // o(k)
    if (this._wordsDict.has(keyWord)) {
      let arr = this._wordsDict.get(keyWord); // o(k)
      if (!arr.includes(word)) {
       
        // let m be number of word in the list o(m*k)  assuming o(m) ~ o(1)
        arr.push(word); // o(1)
        this._wordsCount += 1;
      }
    } else {
      this._wordsDict.set(keyWord, [word]);
      this._wordsCount += 1;
    }

    // let n be the number of words in the dict
    //
    // o((k * n)
  }

  public async getSimilarWords(word: string): Promise<string[]> {
    const keyWord = sortStrAlphabet(word);
    const res = this._wordsDict.get(keyWord) || [];
    return res.filter(w => w !== word);
  }
}

export default SimilarWordsServiceMap;
