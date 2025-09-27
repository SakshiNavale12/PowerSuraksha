import  { useState } from 'react';
import { useAggregatedMotorData } from '../../hooks/useAggregatedMotorData';

const Extrem = () => {
  const { schedule } = useAggregatedMotorData();
  const [motorStates, setMotorStates] = useState<{ [key: string]: boolean }>({});

  const maintenanceDevices = Object.entries(schedule).filter(
    ([, status]) => status === 'Excluded (Maintenance needed)'
  );

  const handleToggle = (deviceId: string) => {
    setMotorStates(prevStates => {
      const newState = !prevStates[deviceId];
      console.log(`Toggling motor ${deviceId} to ${newState ? 'ON' : 'OFF'}`);
      return { ...prevStates, [deviceId]: newState };
    });
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
            <div key={deviceId} className="flex flex-row justify-between items-center border-l-4 p-4 shadow-md rounded-r-lg bg-red-100 border-red-500 text-red-800">
              <div>
                <h3 className="font-bold text-lg capitalize">{deviceId}</h3>
                <p className="text-sm mt-1">{status}</p>
              </div>
              <button
                onClick={() => handleToggle(deviceId)}
                className={`py-1.5 px-3 rounded-md text-sm font-semibold text-white shadow-sm transition-colors duration-200 ${
                  motorStates[deviceId]
                    ? 'bg-red-600 hover:bg-red-700'      
                    : 'bg-green-600 hover:bg-green-700'  
                }`}
              >
                {motorStates[deviceId] ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Extrem;