interface CacheValue {
  value: string;
  updatedAt: number;
}

class Cache {
  cache: Map<string, CacheValue>;
  maxLength: number;

  constructor() {
    this.cache = new Map();
    this.maxLength = 100;
  }

  has(key: string) {
    return this.cache.has(key);
  }

  set(key: string, value: string) {
    if (this.length() > this.maxLength) {
      const leastUsed = this.leastRecentlyUsed();
      this.delete(leastUsed);
    }

    return this.cache.set(key, {
      value,
      updatedAt: Date.now(),
    });
  }

  getValue(key: string): string {
    if (!this.has(key)) {
      return '';
    }

    return this.cache.get(key).value;
  }

  delete(key: string) {
    return this.cache.delete(key);
  }

  clear() {
    return this.cache.clear();
  }

  length() {
    return Array.from(this.cache.keys()).length;
  }

  leastRecentlyUsed() {
    const leastUsed = Array.from(this.cache.keys()).sort(
      (a, b) => this.cache.get(a).updatedAt - this.cache.get(b).updatedAt
    )[0];
    return leastUsed;
  }

  getValues(keys: string[]): { [key: string]: string } {
    const cacheValue = {};

    for (const key of keys) {
      cacheValue[key] = this.getValue(key);
      this.set(key, this.getValue(key));
    }

    return cacheValue;
  }
}

export default new Cache();
