import robotAPI from "./RobotAPI.js";

class RobotFacade {
  async moveRobot(x, y) {
    try {
      const result = await robotAPI.moveRobot(x, y);

      return { success: true, message: "Move successful", data: result };
    } catch (error) {
      return {
        success: false,
        message: "Error moving robot",
        error: error.message,
      };
    }
  }

  async getStatus() {
    try {
      const data = await robotAPI.getStatus();
      console.log(data);

      return { success: true, message: "Robot status fetched", data };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: "Error fetching status",
        error: error.message,
      };
    }
  }

  async resetRobot() {
    try {
      const resetResult = await robotAPI.resetRobot();

      return {
        success: true,
        message: "Robot reset successful",
        data: resetResult,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error resetting robot",
        error: error.message,
      };
    }
  }

  async mapRobot() {
    try {
      const mapResult = await robotAPI.mapRobot();

      return {
        success: true,
        message: "Successful",
        data: mapResult,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting robot map",
        error: error.message,
      };
    }
  }

  async sensorRobot() {
    try {
      const sensorResult = await robotAPI.sensorRobot();
      return {
        success: true,
        message: "Successful",
        data: sensorResult,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting robot sensor",
        error: error.message,
      };
    }
  }
}

export default new RobotFacade();
