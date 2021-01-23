class StatsService {
  private _stats = {
    totalWords: 0,
    totalRequests: 0,
    avgProcessingTimeNs: 0,
  };

  public setTotalWords(totalWords: number) {
    this._stats.totalWords = totalWords;
  }

  public addRequest(processingTimeNs: number) {
    const { _stats } = this;

    const totalProcessingTimeNs = _stats.totalRequests * _stats.avgProcessingTimeNs;

    _stats.totalRequests += 1;
    _stats.avgProcessingTimeNs = (totalProcessingTimeNs + processingTimeNs) / _stats.totalRequests;
  }

  public getStats() {
    return this._stats;
  }

  public reset() {
    for (let prop in this._stats) {
      this._stats[prop] = 0;
    }
  }
}

class Singleton {
  private static _instance: StatsService;

  private constructor() {}

  // TODO not the best idea to use singleton here
  public static getInstance(): StatsService {
    if (!Singleton._instance) {
      Singleton._instance = new StatsService();
    }

    return Singleton._instance;
  }
}

export default Singleton;
