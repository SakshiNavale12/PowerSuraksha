import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistoricalMotorData } from '../../hooks/useHistoricalMotorData';
import TemperatureChart from '../charts/TemperatureChart';
import PressureChart from '../charts/PressureChart';
import CurrentChart from '../charts/CurrentChart';

const DeviceAnalytics = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [timeRange, setTimeRange] = useState<number>(10); // Default to 10 minutes
  const { data, loading, error } = useHistoricalMotorData(deviceId!, timeRange);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(Number(e.target.value));
  };

  const chartData = data.map(d => ({
    name: new Date(d.timestamp).toLocaleTimeString(),
    temperature: d.temperature,
    pressure: d.pressure,
    current: d.current,
  }));

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Analytics for {deviceId}</h1>

      <div className="mb-4">
        <label htmlFor="timeRange" className="mr-2">Select Time Range:</label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={handleTimeRangeChange}
          className="p-2 border rounded"
        >
          <option value={10}>Last 10 Minutes</option>
          <option value={30}>Last 30 Minutes</option>
          <option value={60}>Last 1 Hour</option>
          <option value={1440}>Last 24 Hours</option>
        </select>
      </div>

      {loading && <p>Loading chart data...</p>}
      {error && <p className="text-red-500">Error fetching data: {error.message}</p>}
      
      {!loading && data.length === 0 && <p>No data available for the selected time range.</p>}

      {data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 xl:grid-cols-1">
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">Temperature (°C)</h3>
            <p className='text-sm pb-5'>X-Axis: Time, Y-Axis: Temperature</p>
            <TemperatureChart data={chartData} dataKey="temperature" />
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">Pressure (hPa)</h3>
            <p className='text-sm pb-5'>X-Axis: Time, Y-Axis: Pressure</p>
            <PressureChart data={chartData} dataKey="pressure" />
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">Current (A)</h3>
            <p className='text-sm pb-5'>X-Axis: Time, Y-Axis: Current</p>
            <CurrentChart data={chartData} dataKey="current" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceAnalytics;
