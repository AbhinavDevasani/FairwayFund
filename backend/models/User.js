import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    selectedCharity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      default: null,
    },

    isSubscribed: {
      type: Boolean,
      default: false,
    },
    
    subscriptionPlan: {
      type: String,
      enum: ["monthly", "yearly", null],
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);