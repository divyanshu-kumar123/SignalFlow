import redisClient from '../config/redis.js';

// The assets we are tracking and their baseline starting prices
const ASSETS = {
  BTC: 65000,
  ETH: 3500,
  NIFTY50: 22000,
};

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
      for (const [symbol, basePrice] of Object.entries(ASSETS)) {
        // Get the last known price from Redis, or use the baseline if it's the first run
        const lastPriceStr = await redisClient.hget('live_prices', symbol);
        const lastPrice = lastPriceStr ? parseFloat(lastPriceStr) : basePrice;

        const newPrice = generateMockPrice(lastPrice);

        // Update the Redis hash with the new price
        await redisClient.hset('live_prices', symbol, newPrice);
        
        // Optional: Log to terminal so we can visually confirm it's working
        console.log(`Ticker: ${symbol} -> $${newPrice}`);
      }
    } catch (error) {
      console.error('Ticker Error: Failed to update prices in Redis', error);
    }
  }, 5000); 
};