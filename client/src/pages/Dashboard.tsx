import { useState } from "react";
import { Bot, Wifi, WifiOff, AlertTriangle, UserCog } from "lucide-react";
import { useRobotApi } from "../hooks/useRobotApi";
import { RobotStatusDisplay } from "../components/RobotStatusDisplay";
import { MoveControls } from "../components/MoveControls";

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
  } = useRobotApi(3000); // Poll every 3 seconds

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
      showNotification(`✅ ${response.message}`, "success");
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
                Robot Camera View
              </h2>
              <div className="aspect-video bg-gcs-darker rounded-lg flex items-center justify-center border-2 border-gray-700">
                <div className="text-center">
                  <Bot className="w-24 h-24 mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-500">Live feed simulation</p>
                  {apiStatusResp?.data?.status === "MOVING" && (
                    <p className="text-blue-500 mt-2 animate-pulse">
                      ▶ Robot moving to ({apiStatusResp.data.position.x},{" "}
                      {apiStatusResp.data.position.y})
                    </p>
                  )}
                </div>
              </div>
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
            disabled={!isConnected || apiStatusResp?.data?.status === "STUCK"}
            onReset={onReset}
            isResetting={isResetting}
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
