import { Circle, Activity } from "lucide-react";
import type { StatusIndicatorProps } from "../types";

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  className = "",
}) => {
  const getStatusColor = (): string => {
    switch (status) {
      case "Moving":
        return "text-blue-500 animate-pulse";
      case "Stopped":
        return "text-yellow-500";
      case "Error":
        return "text-red-600 animate-bounce";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Moving":
        return <Activity className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span className="ml-2">{status}</span>
    </span>
  );
};

export default StatusIndicator;
