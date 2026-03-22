import express from "express";
import { checkout, getStatus } from "../controllers/subscriptionController.js";
import { tokenHandler } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/checkout", tokenHandler, checkout);
router.get("/status", tokenHandler, getStatus);
export default router;
