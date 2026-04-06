import { useEffect, useState } from "react";
import { Bot, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { useRobotApi } from "../hooks/useRobotApi";
import { RobotStatusDisplay } from "../components/RobotStatusDisplay";
import { MoveControls } from "../components/MoveControls";
import RobotMap from "../components/RobotMap";
import useTelemetry from "../hooks/useTelemetry";
import SensorPanel from "../components/SensorPanel";
import Navbar from "../components/Navbar";
import { useCookies } from "../hooks/useCookies";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types";
import PageHelmet from "../components/PageHelmet";

const Dashboard = () => {
  const {
    robotStatus: apiStatusResp,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    setLastUpdated,
    refreshStatus,
    moveToCoordinates,
    isMoving,
    moveError,
    resetCoordinates,
    isResetting,
    robotMapResp: robotMapResp,
    isRobotMapLoading,
    robotMap,
  } = useRobotApi();

  const { telemetry, isTelemetryConnected, telemetryError } = useTelemetry();

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

  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: string }>
  >([]);

  const showNotification = (message: string, type: string = "info") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const onMove = async (x: number, y: number) => {
    try {
      const response = await moveToCoordinates(x, y);

      if (response.success) {
        showNotification(`✅ ${response.message}`, "success");
      } else {
        showNotification(`❌ Move failed: ${response.message}`, "error");
      }
    } catch (error) {
      showNotification(`❌ Move failed: ${error}`, "error");
    }
  };

  const onReset = async () => {
    try {
      const response = await resetCoordinates();
      showNotification(`✅ ${response.message}`, "success");
    } catch (error) {
      showNotification(`❌ Move failed: ${error}`, "error");
    }
  };

  useEffect(() => {
    if (apiStatusResp?.success === false) {
      showNotification(`❌ ${apiStatusResp?.message}`, "error");
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
                      ({apiStatusResp?.data?.id} | {apiStatusResp?.data?.status}
                      )
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
            <button
              onClick={refetchStatusAndMap}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs">
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
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
            </div>
          </div>

          {/* Move Controls */}
          {decodedToken && decodedToken.role === "COMMANDER" && (
            <div className="mt-6">
              <MoveControls
                onMove={onMove}
                isMoving={isMoving}
                currentPosition={
                  telemetry?.position ?? apiStatusResp?.data?.position
                }
                disabled={!isConnected}
                onReset={onReset}
                isResetting={isResetting}
                showNotification={showNotification}
              />
            </div>
          )}

          {/* Error Display */}
          {moveError && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-400">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              {moveError}
            </div>
          )}

          {/* Notifications */}
          <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-lg shadow-xl transform transition-all animate-slideIn
                ${
                  n.type === "error"
                    ? "bg-red-600"
                    : n.type === "success"
                      ? "bg-green-600"
                      : n.type === "warning"
                        ? "bg-yellow-600"
                        : "bg-blue-600"
                }`}>
                {n.message}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
