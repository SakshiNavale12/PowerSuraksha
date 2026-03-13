import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const linkClasses = "block py-2.5 px-4 rounded text-lg font-semibold transition duration-200 hover:bg-blue-700 hover:text-white";
  const activeLinkClasses = "bg-blue-700 text-white text-lg font-semibold";

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2 flex flex-col min-h-screen">
      <a href="#" className="text-white text-2xl font-extrabold px-4">Motor Dashboard</a>

      <nav className="flex-1">
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
        >
          Home
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
        >
          Analytics
        </NavLink>
        <NavLink
          to="/extreme"
          className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
        >
          Maintainance Devices
        </NavLink>

        {/* Schedule — Admin only */}
        {isAdmin && (
          <NavLink
            to="/scedule"
            className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
          >
            Scedule Devices
          </NavLink>
        )}

        {/* Register User — Admin only */}
        {isAdmin && (
          <NavLink
            to="/register"
            className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}
          >
            Register User
          </NavLink>
        )}
      </nav>

      {/* User Info + Logout */}
      <div className="px-4 pt-4 border-t border-blue-600">
        <div className="mb-1 text-sm font-semibold text-white truncate">{profile?.name}</div>
        <div className="mb-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isAdmin ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'
          }`}>
            {isAdmin ? 'Admin' : 'Operator'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-sm bg-blue-900 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
