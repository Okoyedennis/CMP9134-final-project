import mongoose from "mongoose";

const missionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userEmail: {
      type: String,
      required: false,
      trim: true,
    },
    userForename: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      required: false,
      trim: true,
    },
    commandType: {
      type: String,
      required: true,
      enum: ["MOVE", "RESET", "STATUS", "MAP", "SENSOR", "ROLE_UPDATE"],
    },
    commandPayload: {
      type: Object,
      default: {},
    },
    statusBefore: {
      type: Object,
      default: null,
    },
    statusAfter: {
      type: Object,
      default: null,
    },
    success: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      default: "Ground Control Station",
    },
  },
  { timestamps: true },
);

const MissionLog = mongoose.model("MissionLog", missionLogSchema);

export default MissionLog;
