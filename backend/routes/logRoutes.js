import express from "express";
import MissionLog from "../models/MissionLog.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const logs = await MissionLog.find().sort({ createdAt: -1 }).limit(100);

    return res.json({
      success: true,
      message: "Mission logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
      error: error.message,
    });
  }
});

export default router;
