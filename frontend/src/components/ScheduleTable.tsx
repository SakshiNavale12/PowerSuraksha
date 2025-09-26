import { useMotorData } from '../hooks/useMotorData';

export default function ScheduleTable() {
  const { schedule } = useMotorData();

  return (
    <div className="bg-gray-800 text-white shadow-lg rounded-lg p-5">
      <h2 className="text-xl font-bold mb-4">Motor Operational Schedule</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">Device ID</th>
              <th className="px-4 py-2">Schedule</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800">
            {Object.keys(schedule).map((deviceId) => (
              <tr key={deviceId} className="border-b border-gray-700">
                <td className="px-4 py-2">{deviceId}</td>
                <td className="px-4 py-2">{schedule[deviceId]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
