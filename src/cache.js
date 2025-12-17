// Simple in-memory cache (with memory leak bug)
class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 3600000) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
    // BUG: Not cleaning up expired entries!
    // Should have: this.cleanup();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      // Item expired, but not removing it (memory leak!)
      return null;
    }
    
    return item.value;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  size() {
    return this.cache.size;
  }
}

module.exports = new CacheService();
