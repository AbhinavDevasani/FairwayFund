import User from "../models/User.js";
import Score from "../models/Score.js";
import Charity from "../models/Charity.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password").populate("selectedCharity");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addScore = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || value < 1 || value > 45) {
      return res.status(400).json({ success: false, message: "Score must be between 1 and 45" });
    }

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    
    const existingScores = await Score.find({ userId: user._id }).sort({ date: 1 });
    if (existingScores.length >= 5) {
      
      await Score.findByIdAndDelete(existingScores[0]._id);
    }

    await Score.create({ userId: user._id, score: value });
    
    const sorted = await Score.find({ userId: user._id }).sort({ date: -1 });
    res.json({ success: true, data: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getScores = async (req, res) => {
  try {
    const sorted = await Score.find({ userId: req.user }).sort({ date: -1 });
    res.json({ success: true, data: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const selectCharity = async (req, res) => {
  try {
    const { charityId } = req.body;
    if (!charityId) {
      return res.status(400).json({ success: false, message: "charityId is required" });
    }

    const charity = await Charity.findById(charityId);
    if (!charity) {
      return res.status(404).json({ success: false, message: "Charity not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user,
      { selectedCharity: charityId },
      { new: true }
    ).select("-password").populate("selectedCharity");

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
