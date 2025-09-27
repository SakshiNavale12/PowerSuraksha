import { useAggregatedMotorData } from '../../hooks/useAggregatedMotorData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data?: any[];
  dataKey?: string;
}

export default function TemperatureChart({ data, dataKey = 'temperature' }: ChartProps) {
  const aggregatedData = useAggregatedMotorData();
  
  let chartData = data;
  if (!chartData) {
    const { metrics } = aggregatedData;
    chartData = Object.keys(metrics).map((deviceId) => ({
      name: deviceId,
      [dataKey]: parseFloat(metrics[deviceId].avgTemp.toFixed(2)),
    }));
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 25, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
        <YAxis label={{ value: '', position: 'insideBottom ', offset: 20 ,angle: -90,}} tick={{ fontSize: 20 }}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} name="Temperature" stroke="#0c00faff" dot={false}  />
      </LineChart>
    </ResponsiveContainer>
  );
}
