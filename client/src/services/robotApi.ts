import axiosInstance from "./axiosConfig";
import { type AxiosResponse } from "axios";

// Types based on the API response
export interface RobotPosition {
  x: number;
  y: number;
}

export type RobotStatusType = "IDLE" | "MOVING" | "LOW_BATTERY" | "STUCK";

export interface RobotStatus {
  message: string;
  data: {
    id: string;
    position: RobotPosition;
    battery: number;
    status: string;
  };

  success: boolean;
}

// Move command types - based on your API
export interface MoveCommand {
  x: number;
  y: number;
}

export interface MoveResponse {
  message: string;
}

export interface ResetResponse {
  message: string;
}

export interface CommandResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// API Service class with Axios
class RobotApiService {
  // Get robot status
  async getRobotStatus(): Promise<RobotStatus> {
    try {
      const response: AxiosResponse<RobotStatus> =
        await axiosInstance.get("/status");
      return response.data;
    } catch (error) {
      console.error("Error in getRobotStatus:", error);
      throw error;
    }
  }

  // Send move command
  async sendMoveCommand(x: number, y: number): Promise<MoveResponse> {
    try {
      const response: AxiosResponse<MoveResponse> = await axiosInstance.post(
        "/move",
        { x, y },
      );
      return response.data;
    } catch (error) {
      console.error("Error in sendMoveCommand:", error);
      throw error;
    }
  }

  // Send reset command
  async sendResetCommand(): Promise<ResetResponse> {
    try {
      const response: AxiosResponse<ResetResponse> = await axiosInstance.post(
        "/reset",
        null,
      );
      return response.data;
    } catch (error) {
      console.error("Error in resetCommand:", error);
      throw error;
    }
  }

  // Get robot logs/history
  async getRobotLogs(limit: number = 10): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await axiosInstance.get("/logs", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getRobotLogs:", error);
      throw error;
    }
  }

  // Check API health
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response: AxiosResponse<{ status: string; timestamp: string }> =
        await axiosInstance.get("/health");
      return response.data;
    } catch (error) {
      console.error("Error in checkHealth:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const robotApi = new RobotApiService();
