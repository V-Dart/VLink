import { NavLink, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { useState, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo-profile.png";
import ProfilePicture from "../ProfilePicture";
import SlideMenu from "./SlideMenu";

export default function Sidebar() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setUserProfile(JSON.parse(user));
      } catch {
        setUserProfile(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/po/logout');
  };

  // Hamburger hover/click logic
  const handleHamburgerHover = () => setMenuOpen(true);
  const handleHamburgerLeave = () => setMenuOpen(false);
  const handleHamburgerClick = () => setMenuOpen((open) => !open);

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-12 bg-[#1e293b] flex flex-col justify-between items-center py-4 z-30">
        <div className="flex flex-col items-center gap-4">
          <img
            src={logo}
            alt="PO Logo"
            className="w-8.5 h-8 rounded-full object-cover"
          />
          <div
            onMouseEnter={handleHamburgerHover}
            onMouseLeave={handleHamburgerLeave}
            style={{ width: 48, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <button
              onClick={handleHamburgerClick}
              style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FaBars className="text-white text-xl hover:text-gray-300" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <NavLink to="/po/profile">
              <ProfilePicture
                src={userProfile?.profilePicture}
                alt="Profile"
                size="small"
                className="hover:ring-2 hover:ring-gray-300 transition-all"
              />
            </NavLink>
            <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Profile
            </span>
          </div>
          <div className="relative group">
            <NavLink to="/po/settings">
              <FiSettings className="text-white text-xl hover:text-gray-300" />
            </NavLink>
            <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Settings
            </span>
          </div>
          <div className="relative group">
            <button
              onClick={handleLogout}
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
      <SlideMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
} 