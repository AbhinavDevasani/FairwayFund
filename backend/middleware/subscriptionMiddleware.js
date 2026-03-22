import User from "../models/User.js";

export const requireSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    
    if (!user || user.isSubscribed !== true) {
      return res.status(403).json({ success: false, message: "Active subscription required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
