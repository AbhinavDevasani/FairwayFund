import mongoose from "mongoose";

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    totalDonations: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Charity", charitySchema);
