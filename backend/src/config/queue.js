import { Queue } from 'bullmq';
import redisClient from './redis.js';

//  Initializes the BullMQ queue for processing alert notifications.
export const alertQueue = new Queue('alert-notifications', {
  connection: redisClient,
});