/**
 * Ultra-fast in-memory API response cache with TTL
 * Dramatically improves page load times by avoiding redundant API calls
 */

const cache = new Map();

/**
 * Get cached response or fetch fresh data
 * @param {string} key - Cache key (usually the API endpoint)
 * @param {Function} fetchFn - Async function to fetch data if not cached
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns {Promise<any>}
 */
export async function getCachedData(key, fetchFn, ttl = 5 * 60 * 1000) {
  const now = Date.now();
  const cached = cache.get(key);

  // Return cached data if valid
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  try {
    // Fetch fresh data
    const data = await fetchFn();
    
    // Store in cache with expiration
    cache.set(key, {
      data,
      expiresAt: now + ttl,
    });

    return data;
  } catch (error) {
    // Return stale data if available during errors
    if (cached) {
      console.warn(`Using stale cache for ${key} due to error:`, error);
      return cached.data;
    }
    throw error;
  }
}

/**
 * Clear all cache or specific key
 */
export function clearCache(key = null) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
