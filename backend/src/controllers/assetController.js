import { asyncHandler } from '../utils/asyncHandler.js';
import redisClient from '../config/redis.js';
import { SUPPORTED_ASSETS } from '../config/constants.js';


/**
 * @desc    Get list of supported assets
 * @route   GET /api/assets
 * @access  Public
 */
export const getSupportedAssets = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: SUPPORTED_ASSETS
  });
});

// /**
//  * @desc    Get historical charting data for a specific asset
//  * @route   GET /api/assets/:symbol/history
//  * @access  Public
//  */
export const getAssetHistory = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  
  const currentPriceStr = await redisClient.hget('live_prices', symbol.toUpperCase());
  let currentPrice = currentPriceStr ? parseFloat(currentPriceStr) : 100; 

  const history = [];
  let time = Math.floor(Date.now() / 1000) - (60 * 3); 
  let mockPrice = currentPrice * 0.98; 

  for (let i = 0; i < 60; i++) {
    const open = mockPrice;
    const close = open + (open * 0.005 * (Math.random() * 2 - 1));
    const high = Math.max(open, close) + (open * 0.001);
    const low = Math.min(open, close) - (open * 0.001);

    history.push({ time, open, high, low, close });
    mockPrice = close;
    time += 3; 
  }

  history[history.length - 1].close = currentPrice;

  res.status(200).json({ 
    status: 'success', 
    data: history 
  });
});