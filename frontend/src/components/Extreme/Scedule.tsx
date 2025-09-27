import { useAggregatedMotorData } from '../../hooks/useAggregatedMotorData';

const Scedule = () => {
  const { schedule } = useAggregatedMotorData();
  const statusPriority: { [key: string]: number } = {
    'Monitoring Required (Reduced Load)': 1,
    'Evening slot (Heavy Load)': 3,
    'Night slot (Medium Load)': 4,
    'Morning slot (Light Load)': 2,
  };

  const operationalSchedule = Object.entries(schedule)
    .filter(([, status]) => status !== 'Excluded (Maintenance needed)')
    .sort(([, statusA], [, statusB]) => {
      const priorityA = statusPriority[statusA] || 99;
      const priorityB = statusPriority[statusB] || 99;
      return priorityA - priorityB;
    });
    
  const getStatusColor = (status: string) => {
    if (status.includes('Maintenance')) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    if (status.includes('Monitoring')) {
      return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    }
     if (status.includes('Light')) {
      return 'bg-green-100 border-green-500 text-green-800';
    }
    if (status.includes('Heavy')) {
      return 'bg-orange-100 border-orange-500 text-orange-800';
    }
    if (status.includes('Medium')) {
      return 'bg-blue-100 border-blue-500 text-blue-800';
    }
   
    return 'bg-gray-100 border-gray-400';
  };

  if (operationalSchedule.length === 0) {
    return <div className="p-5 text-gray-500 text-lg">Generating operational schedule...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Motor Operational Schedule</h1>
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {operationalSchedule.map(([deviceId, status]) => (
          <div key={deviceId} className={`border-l-4 p-4 shadow-md rounded-r-lg ${getStatusColor(status)}`}>
            <h3 className="font-bold text-lg capitalize">{deviceId}</h3>
            <p className="text-sm mt-1">{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scedule;