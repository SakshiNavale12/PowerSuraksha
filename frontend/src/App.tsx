import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/device/Sidebar';
import HomePage from './components/device/HomePage';
import AnalyticsPage from './components/device/AnalyticsPage';

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 text-2xl font-bold bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
