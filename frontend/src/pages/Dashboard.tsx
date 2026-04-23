import { useEffect, useState } from "react";
import { Bot, Wifi, WifiOff, Move } from "lucide-react";
import { useRobotApi } from "../hooks/useRobotApi";
import { RobotStatusDisplay } from "../components/RobotStatusDisplay";
import { MoveControls } from "../components/MoveControls";
import RobotMap from "../components/RobotMap";
import SensorPanel from "../components/SensorPanel";
import Navbar from "../components/Navbar";
import { useCookies } from "../hooks/useCookies";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken, TelemetryData } from "../types";
import PageHelmet from "../components/PageHelmet";
import Button from "../components/Button";
import { toast } from "react-toastify";

interface DashboardProps {
  telemetry: TelemetryData | null;
  isTelemetryConnected: boolean;
  telemetryError: string | null;
}
const Dashboard: React.FC<DashboardProps> = ({
  telemetry,
  isTelemetryConnected,
  telemetryError,
}) => {
  const [showMoveModal, setShowMoveModal] = useState(false);

  const {
    robotStatus: apiStatusResp,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    setLastUpdated,
    refreshStatus,
    moveToCoordinates,
    resetCoordinates,
    isResetting,
    robotMapResp: robotMapResp,
    isRobotMapLoading,
    robotMap,
    isLoadingMove,
  } = useRobotApi();

  const { getCookie } = useCookies();

  const refetchStatusAndMap = () => {
    refreshStatus();
    robotMap();
  };

  const token: any = getCookie("gcs_token");
  let decodedToken: DecodedToken | null = null;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  const toggleMoveModal = () => {
    setShowMoveModal(!showMoveModal);
  };

  const onMove = async (x: number, y: number) => {
    try {
      const response = await moveToCoordinates(x, y);

      if (response.success) {
        toast.success(`✅ ${response.message}`);
      } else {
        toast.error(`❌ Move failed: ${response.message}`);
      }
    } catch (error) {
      toast.error(`❌ Move failed: ${error}`);
    }
  };

  const onReset = async () => {
    try {
      const response = await resetCoordinates();
      toast.success(`✅ ${response.message}`);
    } catch (error) {
      toast.error(`❌ Move failed: ${error}`);
    }
  };

  useEffect(() => {
    if (apiStatusResp?.success === false) {
      toast.error(`❌ ${apiStatusResp?.message}`);
    }
  }, [apiStatusResp]);

  useEffect(() => {
    setLastUpdated(new Date());
  }, [telemetry]);

  return (
    <>
      <PageHelmet
        title="Dashboard | Robot GCS"
        description="Monitor robot position, movement, telemetry, and system status."
      />
      <div className="min-h-screen bg-gcs-dark text-gray-100">
        <Navbar active="dashboard" />

        <main className="container mx-auto px-4 py-6">
          {/* Connection Status */}
          <div
            className={`mb-4 p-3 rounded-lg text-sm flex items-center justify-between ${
              isConnected
                ? "bg-green-900/50 text-green-400"
                : "bg-red-900/50 text-red-400"
            }`}>
            <div className="flex items-center">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 mr-2 animate-pulse" />
                  Connected to robot API
                  {apiStatusResp && (
                    <span className="ml-2 text-xs">
                      ({apiStatusResp?.data?.id} |{" "}
                      {apiStatusResp?.data?.status.replace("_", " ")})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 mr-2" />
                  Disconnected - {error || "Check connection"}
                </>
              )}
            </div>
            <Button
              type="button"
              onClick={refetchStatusAndMap}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs">
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <div
            className={`mb-4 p-3 rounded-lg text-sm flex items-center justify-between ${
              isTelemetryConnected
                ? "bg-blue-900/50 text-blue-400"
                : "bg-yellow-900/50 text-yellow-400"
            }`}>
            <div>
              {isTelemetryConnected
                ? "Live telemetry connected"
                : `Telemetry disconnected${telemetryError ? ` - ${telemetryError}` : ""}`}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Robot View */}
            <div className="lg:col-span-2">
              <div className="gcs-card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-blue-500" />
                  Robot Environment Map
                </h2>

                <RobotMap
                  robotPosition={
                    telemetry?.position || apiStatusResp?.data?.position
                  }
                  robotMapResp={robotMapResp}
                  isRobotMapLoading={isRobotMapLoading}
                  error={error}
                />

                {(telemetry?.status || apiStatusResp?.data?.status) ===
                  "MOVING" && (
                  <p className="text-blue-500 mt-4 animate-pulse text-sm">
                    ▶ Robot moving to (
                    {telemetry?.position?.x ?? apiStatusResp?.data?.position?.x}
                    ,{" "}
                    {telemetry?.position?.y ?? apiStatusResp?.data?.position?.y}
                    )
                  </p>
                )}
              </div>
            </div>

            {/* Status Panel */}
            <div className="lg:col-span-1">
              <RobotStatusDisplay
                telemetry={telemetry}
                apiStatusResp={apiStatusResp}
                isLoading={isLoading}
                error={error}
                isConnected={isConnected}
                lastUpdated={lastUpdated}
                onRefresh={refetchStatusAndMap}
              />
              <div className="mt-6">
                <SensorPanel sensorData={telemetry?.sensors || null} />
              </div>
              {decodedToken && decodedToken.role === "COMMANDER" && (
                <Button
                  type="button"
                  onClick={toggleMoveModal}
                  disabled={
                    !isConnected ||
                    telemetry?.status == "MOVING" ||
                    isLoadingMove ||
                    isResetting
                  }
                  className="control-btn flex items-center justify-center mt-6"
                  aria-label="Open move controls">
                  <Move className="w-5 h-5 mr-2" />
                  {isLoadingMove
                    ? "MOVING..."
                    : isResetting
                      ? "RESETTING..."
                      : "MOVE ROBOT / RESET ROBOT"}
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Move Controls */}
        {showMoveModal && (
          <div className="mt-6">
            <MoveControls
              onMove={onMove}
              currentPosition={
                telemetry?.position ?? apiStatusResp?.data?.position
              }
              onReset={onReset}
              toggleMoveModal={toggleMoveModal}
              telemetry={telemetry}
              isLoadingMove={isLoadingMove}
              isResetting={isResetting}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
