import { createClient } from '@/supabase-clients/client';

export const PERFORMANCE_CONFIG = {
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    longTTL: 60 * 60 * 1000, // 1 hour
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  debouncing: {
    search: 300,
    typing: 1000,
  },
};

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

export function setCachedData<T>(key: string, data: T, ttl: number = PERFORMANCE_CONFIG.cache.defaultTTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

export function clearCache(pattern?: string): void {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export async function batchDatabaseQueries<T>(
  queries: Array<() => Promise<T>>
): Promise<T[]> {
  const results: T[] = [];
  
  // Process queries in batches to avoid overwhelming the database
  const batchSize = 5;
  
  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(query => query()));
    results.push(...batchResults);
    
    // Small delay between batches to prevent rate limiting
    if (i + batchSize < queries.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

export function optimizeImageURL(url: string, width?: number, height?: number): string {
  if (!url) return '';
  
  // Add Cloudinary-style transformations if using a CDN
  if (url.includes('cloudinary.com')) {
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (transformations.length > 0) {
      const baseUrl = url.split('/upload/')[0];
      const path = url.split('/upload/')[1];
      if (baseUrl && path) {
        return `${baseUrl}/upload/${transformations.join(',')}/upload/${path}`;
      }
    }
  }
  
  return url;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateOptimizedQuery(
  table: string,
  filters: Record<string, string | number> = {},
  options: { limit?: number; offset?: number; order?: string } = {}
): string {
  const { limit = PERFORMANCE_CONFIG.pagination.defaultLimit, offset = 0, order = 'created_at.desc' } = options;
  
  let query = `select * from ${table}`;
  
  // Add filters
  const filterConditions = Object.entries(filters)
    .map(([key, value]) => `${key}=${typeof value === 'string' ? `'${value}'` : value}`)
    .join(' and ');
  
  if (filterConditions) {
    query += ` where ${filterConditions}`;
  }
  
  // Add ordering and pagination
  query += ` order by ${order} limit ${Math.min(limit, PERFORMANCE_CONFIG.pagination.maxLimit)} offset ${offset}`;
  
  return query;
}

export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name}: ${end - start}ms`);
  return result;
}

export function lazyLoad<T extends HTMLElement>(
  element: T,
  callback: (entry: IntersectionObserverEntry) => void
): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  observer.observe(element);
}