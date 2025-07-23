import { useState } from "react";
import Sidebar from "../../components/po/Sidebar";

export default function POSettings() {
  const [profileToggle, setProfileToggle] = useState(true);
  const [prefToggle, setPrefToggle] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 ml-[60px]">
        <h1 className="text-2xl font-semibold text-white mb-8 mt-12 md:mt-0 text-center">
          Product Owner - Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Profile Settings Card */}
          <div className="bg-[#1e293b] rounded-lg shadow-lg p-8 flex flex-col gap-4 hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-gray-700">
            <span className="text-lg font-bold text-white mb-2">Profile Settings</span>
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-300">Enable Profile Visibility</span>
              <button
                onClick={() => setProfileToggle((v) => !v)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${profileToggle ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <span
                  className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${profileToggle ? 'translate-x-6' : ''}`}
                />
              </button>
            </div>
            <input
              type="text"
              className="mt-3 w-full p-2 bg-[#273549] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Display Name"
              disabled
            />
          </div>
          {/* Portal Preferences Card */}
          <div className="bg-[#1e293b] rounded-lg shadow-lg p-8 flex flex-col gap-4 hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-gray-700">
            <span className="text-lg font-bold text-white mb-2">Portal Preferences</span>
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-300">Enable Dark Mode</span>
              <button
                onClick={() => setPrefToggle((v) => !v)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${prefToggle ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                <span
                  className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${prefToggle ? 'translate-x-6' : ''}`}
                />
              </button>
            </div>
            <input
              type="email"
              className="mt-3 w-full p-2 bg-[#273549] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notification Email"
              disabled
            />
          </div>
        </div>
      </main>
    </div>
  );
} 