import { useState, useEffect, useCallback, useRef } from "react";
import {
  robotApi,
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
}

export const useRobotApi = (
  pollingInterval: number = 3000,
): UseRobotApiReturn => {
  const [robotStatus, setRobotStatus] = useState<RobotStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveError, setMoveError] = useState<string | null>(null);

  const [isResetting, setIsResetting] = useState<boolean>(false);

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

        // Show success message
        console.log(`Move command sent: ${response.message}`);

        // Immediately refresh status to get new position
        await fetchStatus();

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

      // Show success message
      console.log(`Reset command sent: ${response.message}`);

      // Immediately refresh status to get new position
      await fetchStatus();

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

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

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
  };
};
