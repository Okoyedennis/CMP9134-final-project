import React, { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  X,
  AlertTriangle,
} from "lucide-react";
import type { TelemetryData } from "../types";
import { toast } from "react-toastify";
import Button from "./Button";

interface MoveControlsProps {
  onMove: (x: number, y: number) => Promise<void>;
  currentPosition?: { x: number; y: number };
  onReset: () => Promise<void>;
  isResetting?: boolean;
  toggleMoveModal: () => void;
  telemetry: TelemetryData | null;
  isLoadingMove: boolean;
}

export const MoveControls: React.FC<MoveControlsProps> = ({
  onMove,
  currentPosition,
  onReset,
  toggleMoveModal,
  telemetry,
  isLoadingMove,
  isResetting,
}) => {
  const [targetX, setTargetX] = useState<number>(currentPosition?.x || 0);
  const [targetY, setTargetY] = useState<number>(currentPosition?.y || 0);

  // Preset move amounts
  const movePresets = [10, 15, 20];

  const handleMove = async (x: number, y: number) => {
    try {
      await onMove(x, y);
      toggleMoveModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Move failed");
    }
  };

  const handleReset = async () => {
    try {
      await onReset();
      toggleMoveModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Move failed");
    }
  };

  const handleDirectionMove = (
    direction: "up" | "down" | "left" | "right",
    amount: number = 1,
  ) => {
    let newX = targetX;
    let newY = targetY;

    switch (direction) {
      case "up":
        newY = amount;
        break;
      case "down":
        newY = amount;
        break;
      case "left":
        newX = amount;
        break;
      case "right":
        newX = amount;
        break;
    }

    if (newX < 0 || newX > 20) {
      toast.error(`❌ Input should be between 0 and 20`);
      return;
    }

    if (newY < 0 || newY > 20) {
      toast.error(`❌ Input should be between 0 and 20`);
      return;
    }
    setTargetX(newX);
    setTargetY(newY);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-modal_bg backdrop-blur-lg z-[999]">
      <div className="relative top-1/2 left-1/2 w-[350px] md:w-[524px] -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-gray-200 z-10 cursor-pointer transition duration-2000 rounded-[10px] px-[20px] py-[20px] md:px-[30px] md:py-[30px] h-fit shadow-shadow1">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Move Robot</h4>
          <button
            onClick={toggleMoveModal}
            className="p-1 hover:bg-gray-700 rounded"
            aria-label="Close panel">
            <X className="w-4 h-4" />
          </button>
        </div>

        {telemetry?.battery !== undefined && telemetry?.battery < 1 && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-center animate-pulse">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            BATTERY LOW: Please Reset
          </div>
        )}

        {/* Current Position Display */}
        {currentPosition && (
          <div className="mb-4 p-2 bg-gray-800 rounded-lg text-sm ">
            <div className="text-gray-400 text-center">Current Position:</div>
            <div className="font-mono text-center">
              X: {currentPosition.x}, Y: {currentPosition.y}
            </div>
          </div>
        )}

        {/* Direction Pad with Presets */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2 text-center">
            Quick Move:
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div></div>
            <button
              onClick={() => handleDirectionMove("up")}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Move up">
              <ArrowUp className="w-5 h-5 mx-auto" />
            </button>
            <div></div>

            <button
              onClick={() => handleDirectionMove("left")}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Move left">
              <ArrowLeft className="w-5 h-5 mx-auto" />
            </button>

            <button
              onClick={() => handleDirectionMove("down")}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Move down">
              <ArrowDown className="w-5 h-5 mx-auto" />
            </button>

            <button
              onClick={() => handleDirectionMove("right")}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
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
              <Button
                type="button"
                key={amount}
                onClick={() => handleDirectionMove("up", amount)}
                className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                {amount} units
              </Button>
            ))}
          </div>
        </div>

        {/* Manual Coordinate Input */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Target Coordinates:</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetX" className="block text-xs mb-1">
                X
              </label>
              <input
                type="text"
                id="targetX"
                value={targetX}
                onChange={(e) => {
                  if (parseInt(e.target.value) > 20) {
                    return toast.error(
                      `❌ Input should be less than or equal to 20`,
                    );
                  }
                  setTargetX(parseInt(e.target.value) || 0);
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="targetY" className="block text-xs mb-1">
                Y
              </label>
              <input
                type="text"
                id="targetY"
                value={targetY}
                onChange={(e) => {
                  if (parseInt(e.target.value) > 20) {
                    return toast.error(
                      `❌ Input should be less than or equal to 20`,
                    );
                  }
                  setTargetY(parseInt(e.target.value) || 0);
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            onClick={() => handleMove(targetX, targetY)}
            disabled={
              telemetry?.battery !== undefined && telemetry?.battery < 1
            }
            isLoading={isLoadingMove}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">
            MOVE TO POSITION
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            isLoading={isResetting}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
            RESET
          </Button>
        </div>

        {/* Error Display */}
        {/* {error && (
          <div className="mt-4 p-2 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )} */}
      </div>
    </div>
  );
};
