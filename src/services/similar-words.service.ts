import { logger } from '../utils/logger';
import { sortStrAlphabet } from '../utils/util';
import * as fs from 'fs';
import * as path from 'path';

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

    this._initWordsDict();
  }

  /**
   * Initialize trie with dictionary of english words
   */
  private _initWordsDict() {
    logger.info(`Initializing words dictionary, using file ${process.env.DICTIONARY_FILE_NAME}`);

    logger.warn('Words dictionary parsing logic doesn"t validate nor normialize the dictionary words. Its usses \'new line\' as words seperatore');
    const dictPath = path.join(__dirname, process.env.DICTIONARY_FILE_NAME);
    const words = fs.readFileSync(dictPath).toString().replace(/\r\n/g, '\n').split('\n');
    for (let w of words) {
      this.add(w);
    }

    logger.info(`Initializing dictionary done, total number of added destinct words ${this.size()}`);
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
class SimilarWordsService {
  private _wordsDict: Trie = null;

  constructor() {
    this._wordsDict = new Trie();
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

export default SimilarWordsService;
