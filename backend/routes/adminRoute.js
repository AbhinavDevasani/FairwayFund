import express from "express";
import { getUsers } from "../controllers/adminController.js";
import { tokenHandler } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
const router = express.Router();
router.get("/users", tokenHandler, isAdmin, getUsers);
export default router;
