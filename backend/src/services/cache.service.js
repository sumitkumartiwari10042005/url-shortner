import redisClient from '../config/redis.js';
import Url from '../models/Url.js';

const CACHE_TTL_SECONDS = 24 * 60 * 60;     
const REFRESH_THRESHOLD_SECONDS = 5 * 60; 

const cacheKey = (shortCode) => `url:${shortCode}`;


const inFlightFetches = new Map();


const fetchFromDbAndCache = async (shortCode) => {
  const doc = await Url.findOne({ shortCode }).lean();
  if (!doc) return null;

  await redisClient.set(cacheKey(shortCode), doc.longUrl, 'EX', CACHE_TTL_SECONDS);
  return doc.longUrl;
};


const fetchWithCoalescing = (shortCode) => {
  if (inFlightFetches.has(shortCode)) {
    return inFlightFetches.get(shortCode);
  }

  const promise = fetchFromDbAndCache(shortCode).finally(() => {
    inFlightFetches.delete(shortCode);
  });

  inFlightFetches.set(shortCode, promise);
  return promise;
};


export const getCachedUrl = async (shortCode) => {
  const cached = await redisClient.get(cacheKey(shortCode));

  if (cached) {
    const ttl = await redisClient.ttl(cacheKey(shortCode));
    if (ttl > 0 && ttl < REFRESH_THRESHOLD_SECONDS) {
      
      fetchWithCoalescing(shortCode).catch((err) =>
        console.error(`Background cache refresh failed for ${shortCode}:`, err.message)
      );
    }
    return cached;
  }

  return fetchWithCoalescing(shortCode);
};


export const cacheUrl = async (shortCode, longUrl) => {
  await redisClient.set(cacheKey(shortCode), longUrl, 'EX', CACHE_TTL_SECONDS);
};


export const deleteCachedUrl = async (shortCode) => {
  await redisClient.del(cacheKey(shortCode));
};