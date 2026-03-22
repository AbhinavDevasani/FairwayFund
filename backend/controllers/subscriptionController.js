import User from "../models/User.js";
export const checkout = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({ success: false, message: "Plan must be monthly or yearly" });
    }

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isSubscribed = true;
    user.subscriptionPlan = plan;
    await user.save();

    res.json({ success: true, data: { isSubscribed: true, plan } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: { isSubscribed: user.isSubscribed, plan: user.subscriptionPlan } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};