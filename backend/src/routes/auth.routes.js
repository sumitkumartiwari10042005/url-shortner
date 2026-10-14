import express from 'express';
import { register, login, logout, refreshAccessToken } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register',authLimiter, register);
router.post('/login', authLimiter,login);
router.post('/logout', logout);
router.post('/refresh-token', refreshAccessToken);

export default router;