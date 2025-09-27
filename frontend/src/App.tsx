import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/device/Sidebar';
import HomePage from './components/device/HomePage';
import AnalyticsPage from './components/device/AnalyticsPage';
import Scedule from './components/Extreme/Scedule';
import Extreme from './components/Extreme/Extrem';
import DeviceAnalytics from './components/device/DeviceAnalytics';
import { ExcludedDevicesProvider } from './context/ExcludedDevicesContext';
// Initialize Firebase
import './firebase-config';

function App() {
  return (
    <ExcludedDevicesProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-10 text-2xl font-bold bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/scedule" element={<Scedule />} />
            <Route path="/extreme" element={<Extreme />} />
            <Route path="/device/:deviceId" element={<DeviceAnalytics />} />
          </Routes>
        </main>
      </div>
    </ExcludedDevicesProvider>
  );
}

export default App;
