import Charity from "../models/Charity.js";

export const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find();
    res.json({ success: true, data: charities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCharity = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const charity = await Charity.create({ name, description, image });
    res.status(201).json({ success: true, data: charity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
