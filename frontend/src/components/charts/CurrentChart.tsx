import { useMotorData } from '../../hooks/useMotorData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CurrentChart() {
  const { metrics } = useMotorData();
  const chartData = Object.keys(metrics).map((deviceId) => ({
    name: deviceId,
    current: metrics[deviceId].avgCurrent,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="current" stroke="#ff0000ff" />
      </LineChart>
    </ResponsiveContainer>
  );
}
