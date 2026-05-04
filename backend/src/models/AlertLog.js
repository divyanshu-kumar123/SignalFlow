import mongoose from "mongoose";

// An append-only ledger that records every time a rule's condition is met.
const alertLogSchema = new mongoose.Schema(
  {
    rule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlertRule",
      required: true,
    },
    triggered_price: {
      type: Number,
      required: [true, "The exact price that triggered the alert is required"],
    },
  },
  { timestamps: true },
);

alertLogSchema.index({ rule_id: 1 });

export default mongoose.model("AlertLog", alertLogSchema);
