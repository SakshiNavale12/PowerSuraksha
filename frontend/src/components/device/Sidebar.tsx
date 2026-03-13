import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-lg font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white text-blue-800 shadow-sm'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
    }`;

  return (
    <div className="bg-blue-900 w-60 min-h-screen flex flex-col shadow-xl">

      {/* Logo / Brand */}
      <div className="px-5 py-6 border-b border-blue-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-blue-900 font-black text-sm">PS</span>
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">PowerSuraksha</div>
            <div className="text-blue-300 text-xs">IoT Monitor</div>
          </div>
        </div>
      </div>

      {/* User Profile Card + Logout */}
      <div className="mx-3 mt-4 mb-2 bg-blue-800 rounded-xl p-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-900 font-bold text-base">
              {profile?.name?.charAt(0).toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="overflow-hidden">
            <div className="text-white text-base font-semibold truncate">{profile?.name ?? 'User'}</div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isAdmin ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'
            }`}>
              {isAdmin ? 'Admin' : 'Operator'}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm bg-blue-700 hover:bg-red-600 text-blue-100 hover:text-white font-semibold py-2 rounded-lg transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-4 mb-2 mt-2">Menu</p>

        <NavLink to="/" className={navLink}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </NavLink>

        <NavLink to="/analytics" className={navLink}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </NavLink>

        <NavLink to="/extreme" className={navLink}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Maintenance
        </NavLink>

        {/* Schedule — visible to all */}
        <NavLink to="/scedule" className={navLink}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule Devices
        </NavLink>

        {/* Admin only */}
        {isAdmin && (
          <>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-4 mt-4 mb-2">Admin</p>
            <NavLink to="/register" className={navLink}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register User
            </NavLink>
          </>
        )}
      </nav>

    </div>
  );
}
