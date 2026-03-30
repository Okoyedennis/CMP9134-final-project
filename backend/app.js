import express from "express";
import robotFacade from "./RobotFacade.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Define Routes
app.post("/move", async (req, res) => {
  const { x, y } = req.body;

  if (x === undefined || y === undefined) {
    return res.status(400).json({
      error: "Missing coordinates",
      receivedBody: req.body,
    });
  }

  const result = await robotFacade.moveRobot(x, y);
  res.json(result);
});

app.get("/status", async (req, res) => {
  const result = await robotFacade.getStatus();

  // if (!result.success) {
  //   return res.status(500).json(result);
  // }

  return res.json(result);
});

app.post("/reset", async (req, res) => {
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
