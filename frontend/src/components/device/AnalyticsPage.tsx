import TemperatureChart from '../charts/TemperatureChart';
import PressureChart from '../charts/PressureChart';
import CurrentChart from '../charts/CurrentChart';

export default function AnalyticsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <TemperatureChart />
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <PressureChart />
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <CurrentChart />
        </div>
      </div>
    </div>
  );
}