// Centralized in-memory cache for fast response times and instant invalidation

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const store = new Map<string, CacheEntry<any>>();

export function getCached<T>(key: string, ttlMs: number = 60000): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T): void {
  store.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(keyPrefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(keyPrefix)) {
      store.delete(key);
    }
  }
}
