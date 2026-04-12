import { ChartNoAxesColumn } from "lucide-react";
import Navbar from "../components/Navbar";
import PageHelmet from "../components/PageHelmet";
import type { TelemetryData } from "../types";

interface LidarSummaryProps {
  telemetry: TelemetryData | null;

  isLoading: boolean;
}

const LidarSummary = ({ telemetry, isLoading }: LidarSummaryProps) => {
  const lidar = telemetry?.sensors?.lidar;
  const minDistance = lidar && lidar.length > 0 ? Math.min(...lidar) : 0;
  const maxDistance = lidar && lidar.length > 0 ? Math.max(...lidar) : 0;
  const avgDistance =
    lidar && lidar.length > 0
      ? lidar.reduce((sum, value) => sum + value, 0) / lidar.length
      : 0;

  const front = lidar?.[0] ?? 0;
  const right = lidar?.[90] ?? 0;
  const back = lidar?.[180] ?? 0;
  const left = lidar?.[270] ?? 0;

  const getDistanceColor = (value: number) => {
    if (value <= 2) return "text-red-400";
    if (value <= 5) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <>
      <PageHelmet
        title="Lidar Summary | Robot GCS"
        description="View Lidar sensor data and summary statistics."
      />
      <div className="min-h-screen bg-gcs-dark text-gray-100 app_container">
        <Navbar active="lidar" />
        <main className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ChartNoAxesColumn className="w-5 h-5 mr-2 text-blue-500" />
            Lidar Summary
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
              <p className="mt-2 text-gray-300">Loading lidar...</p>
            </div>
          ) : (
            <>
              {!telemetry?.sensors?.lidar ||
              telemetry.sensors.lidar.length === 0 ? (
                <div className="gcs-card">
                  <p className="text-gray-400 text-center">
                    No Lidar data available.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-sm">Closest Object</p>
                      <p
                        className={`text-2xl font-bold ${getDistanceColor(minDistance)}`}>
                        {minDistance}
                      </p>
                    </div>

                    <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-sm">Furthest Reading</p>
                      <p className="text-2xl font-bold text-green-400">
                        {maxDistance}
                      </p>
                    </div>

                    <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-sm">Average Range</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {avgDistance.toFixed(1)}
                      </p>
                    </div>

                    <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-sm">Scan Points</p>
                      <p className="text-2xl font-bold text-white">
                        {telemetry.sensors.lidar.length}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-400 text-sm mb-1">Front (0°)</p>
                      <p
                        className={`text-xl font-bold ${getDistanceColor(front)}`}>
                        {front}
                      </p>
                    </div>

                    <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-400 text-sm mb-1">Right (90°)</p>
                      <p
                        className={`text-xl font-bold ${getDistanceColor(right)}`}>
                        {right}
                      </p>
                    </div>

                    <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-400 text-sm mb-1">Back (180°)</p>
                      <p
                        className={`text-xl font-bold ${getDistanceColor(back)}`}>
                        {back}
                      </p>
                    </div>

                    <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-400 text-sm mb-1">Left (270°)</p>
                      <p
                        className={`text-xl font-bold ${getDistanceColor(left)}`}>
                        {left}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default LidarSummary;
