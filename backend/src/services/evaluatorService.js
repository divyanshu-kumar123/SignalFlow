import AlertRule from '../models/AlertRule.js';
import redisClient from '../config/redis.js';
import { alertQueue } from '../config/queue.js';

/**
 * Continuously evaluates active user rules against live market prices.
 * Runs on a short interval to ensure rapid detection of market movements.
 */
export const startEvaluator = () => {
  console.log('Rule Evaluator Started...');

  // Running every 2 seconds ensures we process prices quickly after the 5s ticker updates them
  setInterval(async () => {
    try {
      // Fetch the latest prices from our Redis hash
      const prices = await redisClient.hgetall('live_prices');
      if (Object.keys(prices).length === 0) return; // Wait for the ticker to populate data

      // Fetch all rules that have not yet been triggered
      const activeRules = await AlertRule.find({ status: 'active' });

      for (const rule of activeRules) {
        const livePriceStr = prices[rule.asset_symbol];
        if (!livePriceStr) continue; // Skip if we don't have a price for this asset yet

        const livePrice = parseFloat(livePriceStr);
        let isTriggered = false;

        // Business logic evaluation
        if (rule.condition === 'GREATER_THAN' && livePrice > rule.target_price) {
          isTriggered = true;
        } else if (rule.condition === 'LESS_THAN' && livePrice < rule.target_price) {
          isTriggered = true;
        }

        // Trigger Sequence
        if (isTriggered) {
          // Immediately mark as triggered in the DB so we don't evaluate it again on the next loop
          rule.status = 'triggered';
          await rule.save();

          // Hand the notification off to BullMQ to be processed asynchronously
          await alertQueue.add('process-alert', {
            rule_id: rule._id,
            user_id: rule.user_id,
            asset_symbol: rule.asset_symbol,
            condition: rule.condition,
            target_price: rule.target_price,
            triggered_price: livePrice,
          });
        }
      }
    } catch (error) {
      console.error('Evaluator Error: Failed during rule evaluation loop', error);
    }
  }, 2000); 
};