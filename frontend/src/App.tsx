import TemperatureChart from './components/charts/TemperatureChart';
import PressureChart from './components/charts/PressureChart';
import CurrentChart from './components/charts/CurrentChart';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gray-100 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black-900">Motor Monitoring Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-100 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <TemperatureChart />
                </div>
              </div>
              <div className="bg-gray-100 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <PressureChart />
                </div>
              </div>
              <div className="bg-gray-100 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <CurrentChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
