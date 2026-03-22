import express from "express";
import { getCharities, createCharity } from "../controllers/charityController.js";
import { tokenHandler } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
const router = express.Router();
router.get("/", getCharities);
router.post("/", tokenHandler, isAdmin, createCharity);
export default router;
