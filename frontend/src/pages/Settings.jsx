
import { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import { FiUser, FiSettings, FiLock } from "react-icons/fi";

export default function Settings() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [profile, setProfile] = useState({ name: "John Doe", email: "john@example.com" });
  const [preferences, setPreferences] = useState({ theme: "dark", notifications: true });
  const [security, setSecurity] = useState({ oldPassword: "", password: "", confirmPassword: "" });

  const handleHamburgerHover = () => {
    if (!isPermanent) setMenuOpen(true);
  };
  const handleHamburgerLeave = () => {
    if (!isPermanent && !isHoveringMenu) setMenuOpen(false);
  };
  const handleHamburgerClick = () => {
    setPermanent((prev) => !prev);
    setMenuOpen((prev) => (!isPermanent ? true : false));
  };
  const handleMenuHover = () => {
    setIsHoveringMenu(true);
    if (!isPermanent) setMenuOpen(true);
  };
  const handleMenuLeave = () => {
    setIsHoveringMenu(false);
    if (!isPermanent) setMenuOpen(false);
  };

  // Handlers for forms (no backend, just local state)
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handlePreferencesChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPreferences({ ...preferences, [name]: type === "checkbox" ? checked : value });
  };
  const handleSecurityChange = (e) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar
        toggleSlideMenu={handleHamburgerClick}
        onHamburgerHover={handleHamburgerHover}
        onHamburgerLeave={handleHamburgerLeave}
        isPermanent={isPermanent}
      />
      {isMenuOpen && <div className="fixed top-0 left-16 h-full z-10"></div>}
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => {
          if (!isPermanent) setMenuOpen(false);
        }}
        onMenuHover={handleMenuHover}
        onMenuLeave={handleMenuLeave}
      />
      <main
        className={`flex-1 flex flex-col gap-6 p-6 transition-all duration-300 ${isMenuOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}
      >
        {/* Sticky Header */}
        <div className="sticky top-6 z-20 bg-[#0f172a] rounded-xl">
          <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-white mt-1">Manage your account and preferences</p>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 bg-[#273549] p-1 rounded-lg">
              {[
                { label: "Profile", icon: <FiUser className="inline mr-2" /> },
                { label: "Preferences", icon: <FiSettings className="inline mr-2" /> },
                { label: "Security", icon: <FiLock className="inline mr-2" /> },
              ].map(tab => (
                <button
                  key={tab.label}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    selectedTab === tab.label
                      ? 'bg-[#1e293b] text-blue-400 shadow-sm'
                      : 'text-white hover:text-blue-200'
                  }`}
                  onClick={() => setSelectedTab(tab.label)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] p-8 w-full max-w-2xl mx-auto">
          {selectedTab === "Profile" && (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Save Profile
              </button>
            </form>
          )}
          {selectedTab === "Preferences" && (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Theme</label>
                <select
                  name="theme"
                  value={preferences.theme}
                  onChange={handlePreferencesChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={preferences.notifications}
                  onChange={handlePreferencesChange}
                  className="accent-blue-600"
                />
                <label className="text-white">Enable Notifications</label>
              </div>
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Save Preferences
              </button>
            </form>
          )}
          {selectedTab === "Security" && (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Old Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={security.oldPassword}
                  onChange={handleSecurityChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={security.password}
                  onChange={handleSecurityChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={security.confirmPassword}
                  onChange={handleSecurityChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}