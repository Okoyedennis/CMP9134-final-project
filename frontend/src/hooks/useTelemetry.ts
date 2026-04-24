import { useEffect, useState } from "react";
import type { TelemetryData } from "../types";

const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isTelemetryConnected, setIsTelemetryConnected] = useState(false);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const TELEMETRY_WS_URL = import.meta.env.VITE_TELEMETRY_WS_URL;

  useEffect(() => {
    setIsLoading(true);
    const socket = new WebSocket(`${TELEMETRY_WS_URL}/ws/telemetry`);

    socket.onopen = () => {
      setIsTelemetryConnected(true);
      setTelemetryError(null);
      console.log("Telemetry WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data: TelemetryData = JSON.parse(event.data);
        setTelemetry(data);
      } catch (error) {
        console.error("Invalid telemetry data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    socket.onerror = () => {
      setTelemetryError("Telemetry connection error");
    };

    socket.onclose = () => {
      setIsTelemetryConnected(false);
      console.log("Telemetry WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  return {
    telemetry,
    isTelemetryConnected,
    telemetryError,
    isLoading,
  };
};

export default useTelemetry;
