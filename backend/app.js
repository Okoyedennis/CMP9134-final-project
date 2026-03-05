import express from "express";
import robotFacade from "./RobotFacade.js";
const app = express();
const port = 3000;

// Define Routes
app.get("/move", async (req, res) => {
  const { x, y } = req.query; // Get coordinates from query params
  const result = await robotFacade.moveRobot(x, y);
  res.json(result);
});

app.get("/status", async (req, res) => {
  const result = await robotFacade.getStatus();
  res.json(result);
});

app.get("/reset", async (req, res) => {
  const result = await robotFacade.resetRobot();
  res.json(result);
});

app.get("/map", async (req, res) => {
  const result = await robotFacade.mapRobot();
  res.json(result);
});

app.get("/sensor", async (req, res) => {
  const result = await robotFacade.sensorRobot();
  res.json(result);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
