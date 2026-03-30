type MapResponse = {
  width: number;
  height: number;
  grid: number[][];
};

type RobotMapProps = {
  robotPosition?: {
    x: number;
    y: number;
  };
  robotMapResp: MapResponse | any;
  isRobotMapLoading: boolean;
  error: string | null;
};

const RobotMap: React.FC<RobotMapProps> = ({
  robotPosition,
  robotMapResp,
  isRobotMapLoading,
  error,
}: RobotMapProps) => {
  if (isRobotMapLoading) {
    return (
      <div className="aspect-video bg-gcs-darker rounded-lg flex items-center justify-center border-2 border-gray-700">
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-gcs-darker rounded-lg flex items-center justify-center border-2 border-red-700">
        <p className="text-red-400">Map error: {error}</p>
      </div>
    );
  }

  if (!robotMapResp?.data) {
    return (
      <div className="aspect-video bg-gcs-darker rounded-lg flex items-center justify-center border-2 border-gray-700">
        <p className="text-gray-400">No map data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gcs-darker rounded-lg border-2 border-gray-700 p-4">
      <div
        className="grid gap-[2px] mx-auto w-fit"
        style={{
          gridTemplateColumns: `repeat(${robotMapResp.data.width}, minmax(0, 1fr))`,
        }}>
        {robotMapResp.data.grid.map((row: number[], y: number) =>
          row.map((cell, x) => {
            const isRobot =
              robotPosition &&
              robotPosition.x - 1 === x &&
              robotPosition.y - 1 === y;

            return (
              <div
                key={`${x}-${y}`}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm border border-gray-800 ${
                  isRobot
                    ? "bg-blue-500"
                    : cell === 1
                      ? "bg-gray-900"
                      : "bg-gray-300"
                }`}
                title={
                  isRobot
                    ? `Robot position (${x + 1}, ${y + 1})`
                    : cell === 1
                      ? `Obstacle at (${x + 1}, ${y + 1})`
                      : `Free space at (${x + 1}, ${y + 1})`
                }
              />
            );
          }),
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-blue-500 inline-block"></span>
          Robot
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-gray-900 inline-block"></span>
          Obstacle
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-gray-300 inline-block"></span>
          Free space
        </div>
      </div>
    </div>
  );
};

export default RobotMap;
