interface CacheValue {
  value: string;
  updatedAt: number;
}

class Cache {
  cache: Map<string, CacheValue>;
  maxLength: number;
  length: number;

  constructor() {
    this.cache = new Map();
    this.maxLength = 1000;
    this.length = 0;
  }

  has(key: string) {
    return this.cache.has(key);
  }

  set(key: string, value: string) {
    if (this.length >= this.maxLength) {
      const leastUsed = this.leastRecentlyUsed();
      this.delete(leastUsed);
    }

    if (!this.has(key)) this.length += 1;

    return this.cache.set(key, {
      value,
      updatedAt: Date.now(),
    });
  }

  getValue(key: string): string {
    if (!this.has(key)) {
      return '';
    }

    const { value } = this.cache.get(key);
    this.set(key, value);
    return value;
  }

  delete(key: string) {
    this.length -= 1;
    return this.cache.delete(key);
  }

  clear() {
    this.length = 0;
    return this.cache.clear();
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
    }

    return cacheValue;
  }
}

export default new Cache();
