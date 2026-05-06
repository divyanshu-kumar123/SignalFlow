import redisClient from '../config/redis.js';
import { getIO } from '../config/socket.js'; // <-- ADDED: Import the socket instance
import { DEFAULT_PRICES } from '../config/constants.js';

/**
 * Simulates real-time market fluctuations.
 * Generates a random price movement between -0.5% and +0.5% of the current price.
 */
const generateMockPrice = (currentPrice) => {
  const volatility = 0.005; // 0.5%
  const change = currentPrice * volatility * (Math.random() * 2 - 1);
  return Number((currentPrice + change).toFixed(2));
};

/**
 * Runs on a continuous loop, updating Redis with fresh prices.
 * We store the prices in a Redis Hash for O(1) read/write performance.
 */
export const startTicker = () => {
  console.log('Mock Price Ticker Started...');

  setInterval(async () => {
    try {
      for (const [symbol, basePrice] of Object.entries(DEFAULT_PRICES)) {
        // Get the last known price from Redis, or use the baseline if it's the first run
        const lastPriceStr = await redisClient.hget('live_prices', symbol);
        const lastPrice = lastPriceStr ? parseFloat(lastPriceStr) : basePrice;

        const newPrice = generateMockPrice(lastPrice);

        // Update the Redis hash with the new price
        await redisClient.hset('live_prices', symbol, newPrice);
        
        // Broadcast the new price instantly to all connected frontend clients
        const io = getIO();
        if (io) {
          io.emit('price-update', {
            symbol: symbol, 
            price: newPrice,
            timestamp: Date.now()
          });
        }

        // Optional: Log to terminal so we can visually confirm it's working
        // console.log(`Ticker: ${symbol} -> $${newPrice}`);
      }
    } catch (error) {
      console.error('Ticker Error: Failed to update prices in Redis', error);
    }
  }, 3000); 
};