/**
 * Cache System with TTL (Time To Live)
 * Caches API responses and file contents
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize = 100;
  private hitCount = 0;
  private missCount = 0;

  /**
   * Set a value in the cache with TTL
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in milliseconds (default: 60s)
   */
  set(key: string, value: T, ttl = 60000) {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  /**
   * Get a value from the cache
   * Returns null if not found or expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // Update hit count
    entry.hits++;
    this.hitCount++;
    
    return entry.value;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidate(pattern: RegExp) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Evict the oldest entry
   */
  private evictOldest() {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hitCount,
      misses: this.missCount,
      hitRate: hitRate.toFixed(2) + '%',
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        hits: entry.hits,
        ttl: entry.ttl,
      })),
    };
  }

  /**
   * Set maximum cache size
   */
  setMaxSize(size: number) {
    this.maxSize = Math.max(1, size);
    
    // Evict entries if over limit
    while (this.cache.size > this.maxSize) {
      this.evictOldest();
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    let count = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }
}

// Export cache instances for different data types
export const fileCache = new Cache<string>();
export const searchCache = new Cache<any>();
export const apiCache = new Cache<any>();

// Export class for testing
export { Cache };

// Auto-cleanup every 5 minutes
setInterval(() => {
  fileCache.cleanup();
  searchCache.cleanup();
  apiCache.cleanup();
}, 5 * 60 * 1000);
