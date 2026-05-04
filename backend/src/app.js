import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/AppError.js';

const app = express();

// Global Middlewares
app.use(cors()); 
app.use(express.json());

// Health check endpoint for deployment environments
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SignalFlow API is healthy' });
});

// API Routes
app.use('/api/auth', authRoutes);

// Handle unhandled routes (404)
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling Middleware
app.use(errorHandler);

export default app;