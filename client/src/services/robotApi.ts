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
  success: boolean;
}

export interface ResetResponse {
  message: string;
  success: boolean;
}
export interface MapResponse {
  message: string;
  data: {
    width: number;
    height: number;
    grid: number[][];
  };
  success: boolean;
}

export interface CommandResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    forename: string;
    email: string;
    role: string;
  }[];
}

export interface LogsResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    role: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    userEmail: string;
    userForename: string;
    commandType: string;
    statusBefore: null;
    statusAfter: null;
    success: boolean;
    errorMessage: null;
    source: string;
  }[];
  pagination: {
    totalLogs: number;
    currentPage: number;
    totalPages: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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
      const response: AxiosResponse<ResetResponse> =
        await axiosInstance.post("/reset");
      return response.data;
    } catch (error) {
      console.error("Error in resetCommand:", error);
      throw error;
    }
  }

  // Robot Map
  async robotMap(): Promise<MapResponse> {
    try {
      const response: AxiosResponse<MapResponse> =
        await axiosInstance.get("/map");

      return response.data;
    } catch (error) {
      console.error("Error in robotMap:", error);
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
      console.error("Error in check health:", error);
      throw error;
    }
  }

  // Check API LOGS
  async getLogs(page: string, limit: string): Promise<LogsResponse> {
    try {
      const response: AxiosResponse<LogsResponse> = await axiosInstance.get(
        `/logs?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error in fetching logs:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const robotApi = new RobotApiService();
