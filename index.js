import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { logger } from './util/logger.js'
import { connectDb } from './util/connectDb.js'

import app from './app'

// dotenv.config({ path: './config.env' });
dotenv.config();

//define port and start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`server start at http://localhost:${PORT}`)
  connectDb()
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message, '💥');
  console.error('Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message, '💥');
  console.error('Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});