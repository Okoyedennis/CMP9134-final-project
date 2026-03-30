import { useState, useEffect, useCallback, useRef } from "react";
import {
  robotApi,
  type MapResponse,
  type MoveResponse,
  type ResetResponse,
  type RobotStatus,
} from "../services/robotApi";
import { AxiosError } from "axios";

interface UseRobotApiReturn {
  robotStatus: RobotStatus | null;
  isLoading: boolean;
  error: string | null;
  refreshStatus: () => Promise<void>;
  isConnected: boolean;
  lastUpdated: Date | null;
  isSending: boolean;
  moveToCoordinates: (x: number, y: number) => Promise<MoveResponse>;
  isMoving: boolean;
  moveError: string | null;
  resetCoordinates: () => Promise<ResetResponse>;
  isResetting: boolean;
  robotMapResp: MapResponse | null;
  isRobotMapLoading: boolean;
}

export const useRobotApi = (pollingInterval: number): UseRobotApiReturn => {
  const [robotStatus, setRobotStatus] = useState<RobotStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveError, setMoveError] = useState<string | null>(null);

  const [isResetting, setIsResetting] = useState<boolean>(false);

  const [robotMapResp, setRobotMapResp] = useState<MapResponse | null>(null);
  const [isRobotMapLoading, setIsRobotMapLoading] = useState<boolean>(false);

  const pollingRef = useRef<any | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await robotApi.getRobotStatus();
      setRobotStatus(status);
      setIsConnected(true);
      setLastUpdated(new Date());
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage = "Failed to fetch robot status";

      if (axiosError.response) {
        errorMessage = `Server error: ${axiosError.response.status}`;
      } else if (axiosError.request) {
        errorMessage = "Cannot connect to robot server";
        setIsConnected(false);
      } else {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const moveToCoordinates = useCallback(
    async (x: number, y: number): Promise<MoveResponse> => {
      setIsMoving(true);
      setMoveError(null);
      setIsSending(true);

      try {
        const response = await robotApi.sendMoveCommand(x, y);
        if (response.success) {
          fetchStatus();
        }
        return response;
      } catch (err) {
        const axiosError = err as AxiosError;
        let errorMessage = "Failed to move robot";

        if (axiosError.response) {
          // The server responded with an error
          errorMessage = `Server error: ${axiosError.response.status}`;
          console.error("Server response:", axiosError.response.data);
        } else if (axiosError.request) {
          // No response received
          errorMessage = "Cannot connect to robot server";
          setIsConnected(false);
        } else {
          // Request setup error
          errorMessage = axiosError.message;
        }

        setMoveError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsMoving(false);
        setIsSending(false);
      }
    },
    [fetchStatus],
  );

  const resetCoordinates = useCallback(async (): Promise<ResetResponse> => {
    setIsResetting(true);
    setMoveError(null);
    setIsSending(true);

    try {
      const response = await robotApi.sendResetCommand();

      if (response.success) {
        fetchStatus();
      }

      return response;
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage = "Failed to move robot";

      if (axiosError.response) {
        // The server responded with an error
        errorMessage = `Server error: ${axiosError.response.status}`;
        console.error("Server response:", axiosError.response.data);
      } else if (axiosError.request) {
        // No response received
        errorMessage = "Cannot connect to robot server";
        setIsConnected(false);
      } else {
        // Request setup error
        errorMessage = axiosError.message;
      }

      setMoveError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsResetting(false);
      setIsSending(false);
    }
  }, [fetchStatus]);

  const robotMap = useCallback(async () => {
    setIsRobotMapLoading(true);
    setError(null);

    try {
      const response = await robotApi.robotMap();
      setRobotMapResp(response);
      // Show success message
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage = "Failed to move robot";

      if (axiosError.response) {
        // The server responded with an error
        errorMessage = `Server error: ${axiosError.response.status}`;
        console.error("Server response:", axiosError.response.data);
      } else if (axiosError.request) {
        // No response received
        errorMessage = "Cannot connect to robot server";
        setIsConnected(false);
      } else {
        // Request setup error
        errorMessage = axiosError.message;
      }

      setError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setIsRobotMapLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    robotMap();
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    if (pollingInterval > 0) {
      pollingRef.current = setInterval(() => {
        fetchStatus();
      }, pollingInterval);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchStatus, pollingInterval]);

  return {
    robotStatus,
    isLoading,
    isSending,
    error,
    refreshStatus: fetchStatus,
    isConnected,
    lastUpdated,
    moveToCoordinates,
    isMoving,
    moveError,
    resetCoordinates,
    isResetting,
    isRobotMapLoading,
    robotMapResp,
  };
};
