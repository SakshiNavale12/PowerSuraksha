import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkClasses = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white";
  const activeLinkClasses = "bg-blue-700 text-white";

  return (
    <div className="bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2">
      <a href="#" className="text-white text-2xl font-extrabold px-4">Motor Dashboard</a>
      <nav>
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
      </nav>
    </div>
  );
}