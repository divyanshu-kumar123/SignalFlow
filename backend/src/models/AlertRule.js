import mongoose from 'mongoose';

/**
 * AlertRule Schema
 * Defines the conditions under which a user wants to be notified.
 */
const alertRuleSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    asset_symbol: {
      type: String,
      required: [true, 'Asset symbol is required (e.g., BTC, ETH)'],
      uppercase: true,
      trim: true,
    },
    condition: {
      type: String,
      enum: ['GREATER_THAN', 'LESS_THAN'],
      required: [true, 'Condition must be GREATER_THAN or LESS_THAN'],
    },
    target_price: {
      type: Number,
      required: [true, 'Target price is required'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'triggered'],
      default: 'active',
    },
  },
  { timestamps: true }
);

alertRuleSchema.index({ status: 1 });
alertRuleSchema.index({ user_id: 1 });

export default mongoose.model('AlertRule', alertRuleSchema);