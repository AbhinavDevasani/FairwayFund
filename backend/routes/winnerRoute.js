import express from "express";
import multer from "multer";
import path from "path";
import { getWinners, uploadProof, verifyWinner ,getMyWinnings} from "../controllers/winnerController.js";
import { tokenHandler } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `proof-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });
const router = express.Router();
router.get("/my", tokenHandler, getMyWinnings);
router.get("/", tokenHandler, isAdmin, getWinners);
router.post("/:id/proof", tokenHandler, upload.single("proof"), uploadProof);
router.put("/:id/verify", tokenHandler, isAdmin, verifyWinner);
export default router;
