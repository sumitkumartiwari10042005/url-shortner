import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// ---------- global middleware ----------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // needed so the refresh-token cookie can be sent/received
}));
app.use(express.json());          // parse JSON request bodies
app.use(cookieParser());          // parse cookies (needed for refresh token)

// ---------- routes ----------
app.get('/', (req, res) => {
  res.send('hello from server');
});

// app.use('/api/auth', authRoutes);
// app.use('/api', urlRoutes);
// app.use('/', redirectRoutes); // GET /:shortCode — mount last, it's a catch-all pattern

// ---------- error handler (mount last, after all routes) ----------
// app.use(errorHandler);

export default app;