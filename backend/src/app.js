import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import urlRoutes from './routes/url.routes.js';
import redirectRoutes from './routes/redirect.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter} from './middleware/rateLimiter.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDist = path.resolve(
  __dirname,
  '../../frontend/dist'
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDist));
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());          
app.use(cookieParser());          


app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.sendFile(
      path.join(frontendDist, 'index.html')
    );
  }

  res.send('hello from server');
});

app.use('/api/auth',authRoutes);
app.use('/api', apiLimiter,urlRoutes);
app.use('/', redirectRoutes);

app.use(notFoundHandler);
app.use(errorHandler); 

export default app;