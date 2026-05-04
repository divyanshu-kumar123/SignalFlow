import { Worker } from 'bullmq';
import redisClient from '../config/redis.js';
import AlertLog from '../models/AlertLog.js';
import { getIO } from '../config/socket.js'; 

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
      const log = await AlertLog.create({
        rule_id,
        triggered_price,
      });

      console.log(`ALERT PROCESSED: User ${user_id} | ${asset_symbol} ${condition} ${target_price} | Triggered at $${triggered_price}`);

      // Broadcast the real-time notification to the frontend
      try {
        const io = getIO();
        // Emit exclusively to the user's private room
        io.to(user_id.toString()).emit('alert-triggered', {
          log_id: log._id,
          rule_id,
          asset_symbol,
          condition,
          target_price,
          triggered_price,
          timestamp: log.createdAt,
        });
      } catch (error) {
        console.error('WebSocket Error: Could not emit alert notification', error);
      }
    },
    { connection: redisClient }
  );

  worker.on('failed', (job, err) => {
    console.error(`Worker Error: Job ${job.id} failed with error - ${err.message}`);
  });

  console.log('BullMQ Worker: Listening for alert jobs...');
};