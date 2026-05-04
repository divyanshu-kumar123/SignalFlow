import AlertRule from '../models/AlertRule.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// /**
//  * @desc    Create a new alert rule
//  * @route   POST /api/alerts
//  * @access  Private
//  */
export const createAlertRule = asyncHandler(async (req, res, next) => {
  const { asset_symbol, condition, target_price } = req.body;

  if (!asset_symbol || !condition || !target_price) {
    return next(new AppError('Please provide asset symbol, condition, and target price', 400));
  }

  const newRule = await AlertRule.create({
    user_id: req.user._id,
    asset_symbol: asset_symbol.toUpperCase(),
    condition,
    target_price,
  });

  res.status(201).json({
    status: 'success',
    data: newRule,
  });
});

// /**
//  * @desc    Get all active and triggered alert rules for the logged-in user
//  * @route   GET /api/alerts
//  * @access  Private
//  */
export const getUserAlertRules = asyncHandler(async (req, res, next) => {
  // We only fetch rules belonging to the authenticated user
  const rules = await AlertRule.find({ user_id: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: rules.length,
    data: rules,
  });
});

// /**
//  * @desc    Delete a specific alert rule
//  * @route   DELETE /api/alerts/:id
//  * @access  Private
//  */
export const deleteAlertRule = asyncHandler(async (req, res, next) => {
  const rule = await AlertRule.findOne({ _id: req.params.id, user_id: req.user._id });

  if (!rule) {
    return next(new AppError('Alert rule not found or you do not have permission to delete it', 404));
  }

  await AlertRule.deleteOne({ _id: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});