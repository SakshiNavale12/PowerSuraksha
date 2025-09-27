import { useEffect } from 'react';
import { useAggregatedMotorData } from '../../hooks/useAggregatedMotorData';
import { useExcludedDevices } from '../../context/ExcludedDevicesContext';

const Extrem = () => {
  const { excludedIds, setExcludedIds } = useExcludedDevices();
  const { schedule } = useAggregatedMotorData();

  const maintenanceDevices = Object.entries(schedule).filter(
    ([, status]) => status === 'Excluded (Maintenance needed)'
  );

  // Initially populate the excluded IDs list with all maintenance devices
  useEffect(() => {
    const maintenanceDeviceIds = maintenanceDevices.map(([deviceId]) => deviceId);
    setExcludedIds(maintenanceDeviceIds);
  }, [schedule]);

  const handleToggle = (deviceId: string) => {
    // When toggling, we remove the device from the excluded list, making it visible again.
    setExcludedIds(prevExcludedIds =>
      prevExcludedIds.filter(id => id !== deviceId)
    );
    console.log(
      `Motor ${deviceId} is now turned on and will be visible on the dashboard.`
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Devices Requiring Maintenance</h1>
      {maintenanceDevices.length === 0 ? (
        <div className="p-5 text-gray-500 text-lg bg-white rounded-lg shadow-md">
          All motors are operating normally. No devices require maintenance at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"> 
          {maintenanceDevices.map(([deviceId, status]) => (
            excludedIds.includes(deviceId) && (
            <div
              key={deviceId}
              className="flex flex-row justify-between items-center border-l-4 p-4 shadow-md rounded-r-lg bg-red-100 border-red-500 text-red-800"
            >
              <div>
                <h3 className="font-bold text-lg capitalize">{deviceId}</h3>
                <p className="text-sm mt-1">{status}</p>
              </div>
              <button
                onClick={() => handleToggle(deviceId)}
                className="py-1.5 px-3 rounded-md text-sm font-semibold text-white shadow-sm transition-colors duration-200 bg-green-600 hover:bg-green-700"
              >
                Turn On
              </button>
            </div>
            )
          ))} 
        </div>
      )}
    </div>
  );
};

export default Extrem;
