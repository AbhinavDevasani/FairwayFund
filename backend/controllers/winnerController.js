import Winner from "../models/Winner.js";

export const getWinners = async (req, res) => {
  try {
    const winners = await Winner.find().populate("user", "name email").populate("draw", "drawDate winningNumbers");
    res.json({ success: true, data: winners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadProof = async (req, res) => {
  try {
    const winner = await Winner.findById(req.params.id);
    if (!winner) return res.status(404).json({ success: false, message: "Winner not found" });

    if (!req.file) return res.status(400).json({ success: false, message: "Please upload an image" });

    winner.proofImage = `/uploads/${req.file.filename}`;
    await winner.save();

    res.json({ success: true, data: winner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyWinner = async (req, res) => {
  try {
    const { status } = req.body; 
    const winner = await Winner.findById(req.params.id);
    if (!winner) return res.status(404).json({ success: false, message: "Winner not found" });

    winner.status = status;
    await winner.save();

    res.json({ success: true, message: `Winner status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyWinnings = async (req, res) => {
  try {
    const winners = await Winner.find({ user: req.user }).populate("draw");
    res.json({ success: true, data: winners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};