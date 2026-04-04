// Robot Types
export interface Position {
  x: number;
  y: number;
}

export type RobotStatus = "Idle" | "Moving" | "Stopped" | "Error";

export interface RobotState {
  battery: number; // 0-100
  status: RobotStatus;
  position: Position;
}

// User Types
export type UserRole = "COMMANDER" | "VIEWER" | "OPERATOR" | "MAINTENANCE";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

// Notification Types
export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  message: string;
  type: NotificationType;
  id?: string;
  duration?: number;
}

// Move Command Types
export type Direction = "forward" | "backward" | "left" | "right" | "stop";

export interface MoveCommand {
  direction: Direction;
  distance: number;
  speed?: number; // 0-100
}

// Props Interfaces
export interface StatusIndicatorProps {
  status: RobotStatus;
  className?: string;
}

export interface TelemetryData {
  battery?: number;
  status?: string;
  position?: {
    x: number;
    y: number;
  };
  sensors?: {
    E: number;
    N: number;
    S: number;
    W: number;
    lidar?: number[];
  };
}

export interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

// Context Types (if using context)
export interface GCSContextType {
  robot: RobotState;
  user: User;
  sendCommand: (command: MoveCommand) => void;
  emergencyStop: () => void;
  notifications: Notification[];
  clearNotification: (id: string) => void;
}

export interface SignupResponse {
  data: {
    message: string;
    success: boolean;
  };
  status: number;
  statusText: string;
}

export interface SigninResponse {
  data: {
    message: string;
    success: boolean;
    token: string;
    user: {
      id: string;
      forename: string;
      email: string;
    };
  };
  status: number;
  statusText: string;
}
