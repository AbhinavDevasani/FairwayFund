import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["monthly", "yearly"], required: true },
    status: { type: String, enum: ["active", "inactive", "cancelled", "lapsed"], default: "active" },
    stripeSessionId: { type: String },
    stripeSubscriptionId: { type: String },
    amount: { type: Number, required: true },
    charityContribution: { type: Number, default: 0 },
    prizePoolContribution: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
