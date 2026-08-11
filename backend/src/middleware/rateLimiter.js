import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../config/redis.js';

const buildRedisStore = () =>
  new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  });


export const shortenLimiter = rateLimit({
  store: buildRedisStore(),
  windowMs: 15 * 60 * 1000, 
  max: 20,                 
  standardHeaders: true,   
  legacyHeaders: false,
  message: { message: 'Too many URLs created from this IP, please try again later' },
});

export const apiLimiter = rateLimit({
  store: buildRedisStore(),
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later' },
});


export const authLimiter = rateLimit({
  store: buildRedisStore(),
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts from this IP, please try again later' },
});