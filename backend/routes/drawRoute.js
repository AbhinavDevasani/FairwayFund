import express from "express";
import { simulateDraw, runDraw, getDraw } from "../controllers/drawController.js";
import { tokenHandler } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { requireSubscription } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();
router.get("/", tokenHandler, requireSubscription, getDraw);
router.post("/simulate", tokenHandler, isAdmin, simulateDraw);
router.post("/run", tokenHandler, isAdmin, runDraw);
export default router;
