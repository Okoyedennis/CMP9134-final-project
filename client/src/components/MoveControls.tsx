import React, { useState } from "react";
import {
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";

interface MoveControlsProps {
  onMove: (x: number, y: number) => Promise<void>;
  isMoving: boolean;
  currentPosition?: { x: number; y: number };
  disabled?: boolean;
  onReset: () => Promise<void>;
  isResetting?: boolean;
}

export const MoveControls: React.FC<MoveControlsProps> = ({
  onMove,
  isMoving,
  currentPosition,
  disabled = false,
  onReset,
  isResetting,
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [targetX, setTargetX] = useState<number>(currentPosition?.x || 0);
  const [targetY, setTargetY] = useState<number>(currentPosition?.y || 0);
  const [error, setError] = useState<string | null>(null);

  // Preset move amounts
  const movePresets = [10, 20, 50];

  const handleMove = async (x: number, y: number) => {
    try {
      setError(null);
      await onMove(x, y);
      setShowPanel(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Move failed");
    }
  };

  const handleReset = async () => {
    try {
      setError(null);
      await onReset();
      setShowPanel(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Move failed");
    }
  };

  const handleDirectionMove = (
    direction: "up" | "down" | "left" | "right",
    amount: number = 20,
  ) => {
    let newX = targetX;
    let newY = targetY;

    switch (direction) {
      case "up":
        newY += amount;
        break;
      case "down":
        newY -= amount;
        break;
      case "left":
        newX -= amount;
        break;
      case "right":
        newX += amount;
        break;
    }

    setTargetX(newX);
    setTargetY(newY);
  };

  return (
    <div className="gcs-card">
      {/* Main Move Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        disabled={disabled || isMoving}
        className="control-btn flex items-center justify-center mb-4"
        aria-label="Open move controls">
        <Move className="w-5 h-5 mr-2" />
        {isMoving
          ? "MOVING..."
          : isResetting
            ? "RESETTING..."
            : "MOVE ROBOT / RESET ROBOT"}
      </button>

      {/* Move Panel */}
      {showPanel && (
        <div className="mt-4 p-4 bg-gcs-darker rounded-lg animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Move Robot</h4>
            <button
              onClick={() => setShowPanel(false)}
              className="p-1 hover:bg-gray-700 rounded"
              aria-label="Close panel">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Position Display */}
          {currentPosition && (
            <div className="mb-4 p-2 bg-gray-800 rounded-lg text-sm">
              <div className="text-gray-400">Current Position:</div>
              <div className="font-mono">
                X: {currentPosition.x}, Y: {currentPosition.y}
              </div>
            </div>
          )}

          {/* Direction Pad with Presets */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">
              Quick Move (20 units):
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <div></div>
              <button
                onClick={() => handleDirectionMove("up")}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                disabled={isMoving}
                aria-label="Move up">
                <ArrowUp className="w-5 h-5 mx-auto" />
              </button>
              <div></div>

              <button
                onClick={() => handleDirectionMove("left")}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                disabled={isMoving}
                aria-label="Move left">
                <ArrowLeft className="w-5 h-5 mx-auto" />
              </button>

              <button
                onClick={() => handleDirectionMove("down")}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                disabled={isMoving}
                aria-label="Move down">
                <ArrowDown className="w-5 h-5 mx-auto" />
              </button>

              <button
                onClick={() => handleDirectionMove("right")}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                disabled={isMoving}
                aria-label="Move right">
                <ArrowRight className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Preset Distances:</div>
            <div className="flex gap-2">
              {movePresets.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleDirectionMove("up", amount)}
                  className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  disabled={isMoving}>
                  {amount} units
                </button>
              ))}
            </div>
          </div>

          {/* Manual Coordinate Input */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">
              Target Coordinates:
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="targetX" className="block text-xs mb-1">
                  X
                </label>
                <input
                  type="number"
                  id="targetX"
                  value={targetX}
                  onChange={(e) => setTargetX(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  disabled={isMoving}
                />
              </div>
              <div>
                <label htmlFor="targetY" className="block text-xs mb-1">
                  Y
                </label>
                <input
                  type="number"
                  id="targetY"
                  value={targetY}
                  onChange={(e) => setTargetY(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  disabled={isMoving}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleMove(targetX, targetY)}
              disabled={isMoving}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">
              {isMoving ? "MOVING..." : "MOVE TO POSITION"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
              RESET
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-2 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
