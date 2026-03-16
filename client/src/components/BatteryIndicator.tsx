import { Battery } from "lucide-react";
import type { BatteryIndicatorProps } from "../types";

const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({
  level,
  className = "",
}) => {
  const getBatteryColor = (): string => {
    if (level > 60) return "text-green-500";
    if (level > 20) return "text-yellow-500";
    return "text-red-500";
  };

  const getBatteryIcon = () => {
    if (level > 80)
      return <Battery className={`w-5 h-5 ${getBatteryColor()}`} />;
    if (level > 50)
      return <Battery className={`w-5 h-5 ${getBatteryColor()}`} />;
    if (level > 20)
      return <Battery className={`w-5 h-5 ${getBatteryColor()}`} />;
    return <Battery className={`w-5 h-5 ${getBatteryColor()}`} />;
  };

  return (
    <div className={`flex items-center ${className}`}>
      {getBatteryIcon()}
      <span className={`ml-2 font-mono ${getBatteryColor()}`}>{level}%</span>
    </div>
  );
};

export default BatteryIndicator;
