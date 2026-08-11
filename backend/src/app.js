import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import urlRoutes from './routes/url.routes.js';
import redirectRoutes from './routes/redirect.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());          
app.use(cookieParser());          


// app.get('/', (req, res) => {
//   res.send('hello from server');
// });

app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);
app.use('/', redirectRoutes);

app.use(notFoundHandler);
app.use(errorHandler); 

export default app;