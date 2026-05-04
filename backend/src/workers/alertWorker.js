import { Worker } from 'bullmq';
import redisClient from '../config/redis.js';
import AlertLog from '../models/AlertLog.js';

/**
 * The background worker that processes triggered alerts.
 * Decouples the heavy lifting of database logging and future websocket broadcasting 
 * from the main evaluation loop.
 */
export const setupAlertWorker = () => {
  const worker = new Worker(
    'alert-notifications',
    async (job) => {
      const { 
        rule_id, 
        user_id, 
        asset_symbol, 
        condition, 
        target_price, 
        triggered_price 
      } = job.data;

      // Create the official audit log in the database
      await AlertLog.create({
        rule_id,
        triggered_price,
      });

      // Log to the terminal for visual confirmation during development
      console.log(`🔔 ALERT PROCESSED: User ${user_id} | ${asset_symbol} ${condition} ${target_price} | Triggered at $${triggered_price}`);

      // Note: later we will inject our WebSocket broadcasting logic here
      // to push this real-time notification to the frontend.
    },
    { connection: redisClient }
  );

  worker.on('failed', (job, err) => {
    console.error(`Worker Error: Job ${job.id} failed with error - ${err.message}`);
  });

  console.log('👷 BullMQ Worker: Listening for alert jobs...');
};