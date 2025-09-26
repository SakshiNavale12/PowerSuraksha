import { useAggregatedMotorData } from '../../hooks/useAggregatedMotorData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CurrentChart() {
  const aggregatedData = useAggregatedMotorData();
  const { metrics } = aggregatedData;
  const chartData = Object.keys(metrics).map((deviceId) => ({
    name: deviceId,
    current: metrics[deviceId].avgCurrent,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={false} label={{ value: 'Devices', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Avg Current (A)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="current" stroke="#ff0000ff" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
