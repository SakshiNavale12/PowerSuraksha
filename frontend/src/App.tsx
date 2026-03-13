import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/device/Sidebar';
import HomePage from './components/device/HomePage';
import AnalyticsPage from './components/device/AnalyticsPage';
import Scedule from './components/Extreme/Scedule';
import Extreme from './components/Extreme/Extrem';
import DeviceAnalytics from './components/device/DeviceAnalytics';
import { ExcludedDevicesProvider } from './context/ExcludedDevicesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './firebase-config';

function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-blue-700 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <ExcludedDevicesProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-10 text-2xl font-bold bg-gray-100">
          <Routes>
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/extreme" element={<ProtectedRoute><Extreme /></ProtectedRoute>} />
            <Route path="/scedule" element={<ProtectedRoute><Scedule /></ProtectedRoute>} />
            <Route path="/device/:deviceId" element={<ProtectedRoute><DeviceAnalytics /></ProtectedRoute>} />
            <Route path="/register" element={<ProtectedRoute adminOnly><RegisterPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ExcludedDevicesProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

export default App;
