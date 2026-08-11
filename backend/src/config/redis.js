import Redis from 'ioredis';
import dotenv from "dotenv"

dotenv.config();

console.log('RAW REDIS_URL:', JSON.stringify(process.env.REDIS_URL));

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  console.log('Redis: connecting...');
});

redisClient.on('ready', () => {
  console.log('Redis: connected and ready');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redisClient;