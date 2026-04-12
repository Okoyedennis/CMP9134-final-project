type SensorPanelProps = {
  sensorData: {
    N: number;
    S: number;
    E: number;
    W: number;
    lidar?: number[];
  } | null;
};

const getSignalColor = (value: number) => {
  if (value <= 1) return "text-red-400";
  if (value <= 3) return "text-yellow-400";
  return "text-green-400";
};

const SensorPanel: React.FC<SensorPanelProps> = ({ sensorData }) => {
  // console.log(sensorData);

  return (
    <div className="gcs-card">
      <h2 className="text-xl font-semibold mb-4">Sensor Data</h2>

      {sensorData && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm">North</p>
              <p
                className={`text-2xl font-bold ${getSignalColor(sensorData.N)}`}>
                {sensorData.N}
              </p>
            </div>

            <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm">South</p>
              <p
                className={`text-2xl font-bold ${getSignalColor(sensorData.S)}`}>
                {sensorData.S}
              </p>
            </div>

            <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm">East</p>
              <p
                className={`text-2xl font-bold ${getSignalColor(sensorData.E)}`}>
                {sensorData.E}
              </p>
            </div>

            <div className="bg-gcs-darker p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm">West</p>
              <p
                className={`text-2xl font-bold ${getSignalColor(sensorData.W)}`}>
                {sensorData.W}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SensorPanel;
