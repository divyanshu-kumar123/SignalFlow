import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import { startTicker } from './services/tickerService.js';
import { setupAlertWorker } from './workers/alertWorker.js'; 
import { startEvaluator } from './services/evaluatorService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  // Start the background price generation loop
  startTicker(); 
  setupAlertWorker();
  startEvaluator();
  
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();