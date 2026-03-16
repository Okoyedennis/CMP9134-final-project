import React from "react";
import {
  Battery,
  MapPin,
  Circle,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import type { RobotStatus } from "../services/robotApi";

interface RobotStatusDisplayProps {
  apiStatusResp: RobotStatus | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export const RobotStatusDisplay: React.FC<RobotStatusDisplayProps> = ({
  apiStatusResp,
  isLoading,
  error,
  isConnected,
  lastUpdated,
  onRefresh,
}) => {
  const getStatusColor = (apiStatus: string) => {
    switch (apiStatus) {
      case "IDLE":
        return "text-gray-400";
      case "MOVING":
        return "text-blue-500 animate-pulse";
      case "LOW_BATTERY":
        return "text-yellow-500";
      case "STUCK":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-500";
    if (level > 20) return "text-yellow-500";
    return "text-red-500";
  };

  if (error) {
    return (
      <div className="gcs-card bg-red-900/20 border-red-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-red-400">
            <WifiOff className="w-5 h-5 mr-2" />
            <span>Connection Error: {error}</span>
          </div>
          <button
            onClick={onRefresh}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="gcs-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          {isConnected ? (
            <Wifi className="w-5 h-5 mr-2 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 mr-2 text-red-500" />
          )}
          Robot Status
        </h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Refresh status">
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading && !apiStatusResp?.data ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : apiStatusResp?.data ? (
        <div className="space-y-4">
          {/* Robot ID */}
          <div className="flex items-center justify-between p-2 bg-gcs-darker rounded-lg">
            <span className="text-gray-400">Robot ID</span>
            <span className="font-mono text-blue-400">
              {apiStatusResp.data.id}
            </span>
          </div>

          {/* Battery */}
          <div className="flex items-center justify-between p-2 bg-gcs-darker rounded-lg">
            <span className="text-gray-400">Battery</span>
            <div className="flex items-center">
              <Battery
                className={`w-5 h-5 mr-2 ${getBatteryColor(apiStatusResp.data.battery)}`}
              />
              <span
                className={`font-mono ${getBatteryColor(apiStatusResp.data.battery)}`}>
                {apiStatusResp.data.battery}%
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-2 bg-gcs-darker rounded-lg">
            <span className="text-gray-400">Status</span>
            <div className="flex items-center">
              <Circle
                className={`w-4 h-4 mr-2 ${getStatusColor(apiStatusResp.data.status)}`}
              />
              <span
                className={`font-mono ${getStatusColor(apiStatusResp.data.status)}`}>
                {apiStatusResp.data.status}
              </span>
            </div>
          </div>

          {/* Position */}
          <div className="flex items-center justify-between p-2 bg-gcs-darker rounded-lg">
            <span className="text-gray-400">Position</span>
            <div className="flex items-center font-mono">
              <MapPin className="w-4 h-4 mr-2 text-red-400" />
              <span>X: {apiStatusResp.data?.position?.x.toFixed(1)}</span>
              <span className="mx-2">|</span>
              <span>Y: {apiStatusResp.data?.position?.y.toFixed(1)}</span>
            </div>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-gray-500 text-right">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No status data available
        </div>
      )}
    </div>
  );
};
