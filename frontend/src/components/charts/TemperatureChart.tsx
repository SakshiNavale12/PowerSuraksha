import { useAggregatedMotorData } from '../../hooks/useAggregatedMotorData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TemperatureChart() {
  const aggregatedData = useAggregatedMotorData();
  const { metrics } = aggregatedData;
  const chartData = Object.keys(metrics).map((deviceId) => ({
    name: deviceId,
    temperature: parseFloat(metrics[deviceId].avgTemp.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 25, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={false} label={{ value: '', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: '', position: 'insideBottom ', offset: 20 ,angle: -90,}} tick={{ fontSize: 20 }}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" name="Temperature Graph" stroke="#0c00faff" dot={false}  />
      </LineChart>
    </ResponsiveContainer>
  );
}
