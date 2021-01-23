class StatsService {
  public static NS_PER_SEC = 1e9;

  private _stats = {
    totalWords: 0,
    totalRequests: 0,
    avgProcessingTimeNs: 0,
  };

  public setTotalWords(totalWords: number) {
    this._stats.totalWords = totalWords;
  }

  /**
   * Update stats with new request data
   * @param processingTimeNs time object returned by process.hrtime
   */
  public addRequest(processingTimeNs: [number, number]) {
    const { _stats } = this;

    /* Based on: https://nodejs.org/docs/latest-v11.x/api/process.html
     * The process.hrtime() method returns the current high-resolution real time in a [seconds, nanoseconds]
     * tuple Array, where nanoseconds is the remaining part of the real time that can't be represented in second
     * precision.
     */
    const diffNs = processingTimeNs[0] * StatsService.NS_PER_SEC + processingTimeNs[1];
    const totalProcessingTimeNs = _stats.totalRequests * _stats.avgProcessingTimeNs;

    _stats.totalRequests += 1;

    _stats.avgProcessingTimeNs = (totalProcessingTimeNs + diffNs) / _stats.totalRequests;
  }

  public getStats() {
    return this._stats;
  }

  public reset() {
    for (const prop in this._stats) {
      this._stats[prop] = 0;
    }
  }
}

class Singleton {
  private static _instance: StatsService;

  private constructor() {}

  // TODO not the best idea to use singleton here, doesn"t play well with test. Should consider managing it on app level
  public static getInstance(): StatsService {
    if (!Singleton._instance) {
      Singleton._instance = new StatsService();
    }

    return Singleton._instance;
  }
}

export default Singleton;
