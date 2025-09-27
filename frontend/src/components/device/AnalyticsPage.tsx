import TemperatureChart from '../charts/TemperatureChart';
import PressureChart from '../charts/PressureChart';
import CurrentChart from '../charts/CurrentChart';

export default function AnalyticsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 xl:grid-cols-1">
      <div className="bg-white  shadow rounded-lg">
        <div className="p-5">
            <p className='text-base pb-5'>X-Axis: Device ID, Y-Axis: Temperature (°C) </p>
          <TemperatureChart dataKey="temperature" />
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <p className='text-base pb-5'>X-Axis: Device ID, Y-Axis: Pressure (hPa) </p>
          <PressureChart dataKey="pressure" />
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <p className='text-base pb-5'>X-Axis: Device ID, Y-Axis: Current (A) </p>
          <CurrentChart dataKey="current" />
        </div>
      </div>
    </div>
  );
}
