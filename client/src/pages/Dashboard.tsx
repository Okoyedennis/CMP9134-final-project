import { useEffect, useState } from "react";
import { Bot, Wifi, WifiOff, AlertTriangle, UserCog } from "lucide-react";
import { useRobotApi } from "../hooks/useRobotApi";
import { RobotStatusDisplay } from "../components/RobotStatusDisplay";
import { MoveControls } from "../components/MoveControls";
import RobotMap from "../components/RobotMap";

function App() {
  const {
    robotStatus: apiStatusResp,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refreshStatus,
    moveToCoordinates,
    isMoving,
    moveError,
    resetCoordinates,
    isResetting,
    robotMapResp: robotMapResp,
    isRobotMapLoading,
  } = useRobotApi(5000); // Poll every 5 seconds

  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: string }>
  >([]);
  console.log(apiStatusResp);

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

  return (
    <div className="min-h-screen bg-gcs-dark text-gray-100">
      {/* Navigation - same as before */}

      <main className="container mx-auto px-4 py-6">
        {/* User Role Banner */}
        <div className="mb-6 p-4 bg-blue-900/50 border border-blue-800 rounded-lg flex items-center">
          <UserCog className="w-5 h-5 mr-3 text-blue-400" />
          <span>
            Current Role: <strong className="text-blue-400">COMMANDER</strong>
            <span className="text-gray-400 ml-2">(Full control access)</span>
          </span>
        </div>

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
                    ({apiStatusResp?.data?.id} | {apiStatusResp?.data?.status})
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
            onClick={refreshStatus}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs">
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
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
                robotPosition={apiStatusResp?.data?.position}
                robotMapResp={robotMapResp}
                isRobotMapLoading={isRobotMapLoading}
                error={error}
              />

              {apiStatusResp?.data?.status === "MOVING" && (
                <p className="text-blue-500 mt-4 animate-pulse text-sm">
                  ▶ Robot moving to ({apiStatusResp.data.position.x},{" "}
                  {apiStatusResp.data.position.y})
                </p>
              )}
            </div>
          </div>

          {/* Status Panel */}
          <div className="lg:col-span-1">
            <RobotStatusDisplay
              apiStatusResp={apiStatusResp}
              isLoading={isLoading}
              error={error}
              isConnected={isConnected}
              lastUpdated={lastUpdated}
              onRefresh={refreshStatus}
            />
          </div>
        </div>

        {/* Move Controls */}
        <div className="mt-6">
          <MoveControls
            onMove={onMove}
            isMoving={isMoving}
            currentPosition={apiStatusResp?.data?.position}
            disabled={!isConnected}
            onReset={onReset}
            isResetting={isResetting}
            showNotification={showNotification}
          />
        </div>

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
  );
}

export default App;
