import redisClient from '../config/redis.js';
import Url from '../models/Url.js';


const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';


const toBase62 = (num) => {
  if (num === 0) return BASE62_CHARS[0];

  let result = '';
  while (num > 0) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
};


const COUNTER_KEY = 'url:counter';


export const generateShortCode = async () => {
  const nextId = await redisClient.incr(COUNTER_KEY); 
  const shortCode = toBase62(nextId);
  return shortCode;
};


export const initializeCounterFromDb = async () => {
  const count = await Url.countDocuments();
  const current = await redisClient.get(COUNTER_KEY);
  if (!current || Number(current) < count) {
    await redisClient.set(COUNTER_KEY, count);
  }
};