import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import subscriptionRoutes from "./routes/subscriptionRoute.js";
import drawRoutes from "./routes/drawRoute.js";
import charityRoutes from "./routes/charityRoute.js";
import winnerRoutes from "./routes/winnerRoute.js";
import adminRoutes from "./routes/adminRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/charity", charityRoutes);
app.use("/api/winner", winnerRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

// Connection event handlers
mongoose.connection.on("connected", () => {
  console.log("Server connected to mongo db");
});

mongoose.connection.on("error", (err) => {
  console.error("DB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn(" DB disconnected");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err.message);
    process.exit(1);
  });
