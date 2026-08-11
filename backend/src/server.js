import dotenv from 'dotenv';
dotenv.config(); 

import app from './app.js';
import connectDB from './config/db.js';
import redisClient from './config/redis.js'; 

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  redisClient.set('test', 'hello').then(() => {
  redisClient.get('test').then(console.log);
   });

  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
};

startServer();