import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCogs, FaDatabase, FaFileAlt, FaBug } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, to: "/po/dashboard" },
  { name: "Client Config", icon: <FaCogs />, to: "/po/client-config" },
  { name: "Manage DB", icon: <FaDatabase />, to: "/po/manage-db" },
  { name: "Logs", icon: <FaFileAlt />, to: "/po/logs" },
  { name: "Issue Tracker", icon: <FaBug />, to: "/po/issues" },
];

export default function SlideMenu({ isOpen, onClose, onMenuHover, onMenuLeave }) {
  return (
    <>
      {/* Overlay dimmer */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-20 transition-opacity duration-300 z-10 ${
          isOpen ? "opacity-200 visible" : "opacity-0 invisible"
        } transition-opacity duration-300 ease-in-out pointer-events-${isOpen ? 'auto' : 'none'}`}
      />

      {/* Sliding panel */}
      <div
        onMouseEnter={onMenuHover}
        onMouseLeave={onMenuLeave}
        className={`fixed top-0 left-2.5 h-full w-51 bg-[#273549] text-white z-20  
            transition-transform duration-300 ease-in-out
            border-l-2 border-gray-600
            ${ isOpen ? "translate-x-10" : "-translate-x-60"} `}
      >
        <div className="p-4 font-semibold text-lg">
          Menu
        </div>
        <nav className="flex flex-col gap-0 mt-0">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={(e) => {
                // Small delay to allow the click to register before closing
                setTimeout(() => onClose(), 100);
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-2 mx-4 rounded-lg transition duration-200 ${
                  isActive ? "bg-[#334155]" : "hover:bg-[#334155]/80"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
 