import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("selectedCharity");
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
