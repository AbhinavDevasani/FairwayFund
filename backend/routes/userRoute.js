import express from "express";
import { getMe, addScore, getScores, selectCharity } from "../controllers/userController.js";
import { tokenHandler } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/me", tokenHandler, getMe);
router.post("/scores", tokenHandler, addScore);
router.get("/scores", tokenHandler, getScores);
router.put("/charity", tokenHandler, selectCharity);
export default router;
