import mongoose from "mongoose";

const drawSchema = new mongoose.Schema(
  {
    drawDate: { type: Date, default: Date.now },
    winningNumbers: {
      type: [Number],
      validate: [(arr) => arr.length === 5, "Must have exactly 5 winning numbers"],
    },
    prizePool: {
      total: { type: Number, default: 0 },
      fiveMatch: { type: Number, default: 0 },
      fourMatch: { type: Number, default: 0 },
      threeMatch: { type: Number, default: 0 },
    },
    fiveMatchCount: { type: Number, default: 0 },
    fourMatchCount: { type: Number, default: 0 },
    threeMatchCount: { type: Number, default: 0 },
    jackpotCarryForward: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    status: { type: String, enum: ["simulated", "published"], default: "simulated" }
  },
  { timestamps: true }
);

export default mongoose.model("Draw", drawSchema);
