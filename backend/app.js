import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { logMissionEvent } from "./utils/logMissionEvent.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import robotFacade from "./routes/RobotFacade.js";
import MissionLog from "./models/MissionLog.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

app.use("/auth", authRoutes);

app.get("/", async (req, res) => {
  return res.json({
    success: true,
    message: "Hello world",
  });
});

// MOVE
app.post("/move", verifyToken, async (req, res) => {
  const { x, y } = req.body;

  if (x === undefined || y === undefined) {
    await logMissionEvent({
      req,
      commandType: "MOVE",
      commandPayload: req.body,
      success: false,
      errorMessage: "Missing coordinates",
    });

    return res.status(400).json({
      success: false,
      message: "Missing coordinates",
    });
  }

  const statusBeforeResult = await robotFacade.getStatus();
  const statusBefore = statusBeforeResult.success
    ? statusBeforeResult.data
    : null;

  const result = await robotFacade.moveRobot(x, y);

  const statusAfterResult = await robotFacade.getStatus();
  const statusAfter = statusAfterResult.success ? statusAfterResult.data : null;

  await logMissionEvent({
    req,
    commandType: "MOVE",
    commandPayload: { x, y },
    statusBefore,
    statusAfter,
    success: result.success,
    errorMessage: result.error || null,
  });

  return res.status(result.success ? 200 : 500).json(result);
});

// RESET
app.post("/reset", verifyToken, async (req, res) => {
  const statusBeforeResult = await robotFacade.getStatus();
  const statusBefore = statusBeforeResult.success
    ? statusBeforeResult.data
    : null;

  const result = await robotFacade.resetRobot();

  const statusAfterResult = await robotFacade.getStatus();
  const statusAfter = statusAfterResult.success ? statusAfterResult.data : null;

  await logMissionEvent({
    req,
    commandType: "RESET",
    commandPayload: {},
    statusBefore,
    statusAfter,
    success: result.success,
    errorMessage: result.error || null,
  });

  return res.status(result.success ? 200 : 500).json(result);
});

// STATUS
app.get("/status", verifyToken, async (req, res) => {
  const result = await robotFacade.getStatus();

  await logMissionEvent({
    req,
    commandType: "STATUS",
    commandPayload: {},
    statusAfter: result.success ? result.data : null,
    success: result.success,
    errorMessage: result.error || null,
  });

  return res.status(result.success ? 200 : 500).json(result);
});

// MAP
app.get("/map", verifyToken, async (req, res) => {
  const result = await robotFacade.mapRobot();

  await logMissionEvent({
    req,
    commandType: "MAP",
    commandPayload: {},
    success: result.success,
    errorMessage: result.error || null,
  });

  return res.status(result.success ? 200 : 500).json(result);
});

// SENSOR
app.get("/sensor", verifyToken, async (req, res) => {
  const result = await robotFacade.sensorRobot();

  await logMissionEvent({
    req,
    commandType: "SENSOR",
    commandPayload: {},
    success: result.success,
    errorMessage: result.error || null,
  });

  return res.status(result.success ? 200 : 500).json(result);
});

// LOGS
app.get("/logs", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalLogs = await MissionLog.countDocuments();

    const logs = await MissionLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalLogs / limit);

    return res.json({
      success: true,
      message: "Mission logs fetched successfully",
      data: logs,
      pagination: {
        totalLogs,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
      error: error.message,
    });
  }
});

// GET USER
app.get("/getUsers", verifyToken, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const usersData = users.map((user) => ({
      id: user._id,
      forename: user.forename,
      email: user.email,
      role: user.role,
    }));

    return res.json({
      success: true,
      message: "Users fetched successfully",
      data: usersData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
