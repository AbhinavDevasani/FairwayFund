import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    draw: { type: mongoose.Schema.Types.ObjectId, ref: "Draw", required: true },
    matchCount: { type: Number, enum: [3, 4, 5], required: true },
    matchedNumbers: { type: [Number], default: [] },
    prizeAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "approved", "rejected", "paid"], default: "pending" },
    proofImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Winner", winnerSchema);
