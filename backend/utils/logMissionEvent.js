import MissionLog from "../models/MissionLog.js";

export async function logMissionEvent({
  req,
  commandType,
  commandPayload = {},
  statusBefore = null,
  statusAfter = null,
  success,
  errorMessage = null,
}) {
  try {
    await MissionLog.create({
      userId: req.user?.userId || null,
      userEmail: req.user?.email || null,
      userForename: req.user?.forename || null,
      role: req.user?.role || null,
      commandType,
      commandPayload,
      statusBefore,
      statusAfter,
      success,
      errorMessage,
    });
  } catch (error) {
    console.error("Failed to write mission log:", error.message);
  }
}
