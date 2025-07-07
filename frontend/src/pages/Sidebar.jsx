// Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import {
  FaTasks,
  FaComments,
  FaChartBar,
  FaProjectDiagram,
  FaStream,
  FaVideo,
  FaCogs,
  FaSignOutAlt,
  FaBars,
  FaUserCircle
} from "react-icons/fa";
import logo from "../assets/logo-profile.png";

export default function Sidebar({ toggleSlideMenu, onHamburgerHover, onHamburgerLeave, isPermanent }) {
  const navigate = useNavigate();

  return (
    <aside className="fixed top-0 left-0 h-screen w-12 bg-[#1e293b] flex flex-col justify-between items-center py-4 z-20">
      <div className="flex flex-col items-center gap-4">
        <img
          src={logo}
          alt="Profile Logo"
          className="w-8.5 h-8 rounded-full object-cover"
        />
        <div
          onMouseEnter={onHamburgerHover}
          onMouseLeave={onHamburgerLeave}
          style={{ width: 48, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <button
            onClick={toggleSlideMenu}
            style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaBars className="text-white text-xl hover:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <NavLink to="/profile">
            <FaUserCircle className="text-white text-xl hover:text-gray-300" />
          </NavLink>
          <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Profile
          </span>
        </div>

        <div className="relative group">
          <NavLink to="/settings">
            <FiSettings className="text-white text-xl hover:text-gray-300" />
          </NavLink>
          <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Settings
          </span>
        </div>

        <div className="relative group">
          <button
            onClick={() => navigate('/login')}
            className="w-10 h-7 flex items-center justify-center"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <HiOutlineLogout className="text-red-500 text-2xl hover:text-red-400 translate-x-[3px]" />
          </button>
          <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
}
