import express from 'express';
import {
  shortenUrl,
  getUserUrls,
  deleteUrl,
} from '../controllers/url.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { shortenLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();


router.post('/shorten', shortenLimiter, optionalAuth, shortenUrl);


router.get('/urls', requireAuth, getUserUrls);
router.delete('/urls/:id', requireAuth, deleteUrl);

export default router;