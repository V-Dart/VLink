import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import { FiUsers, FiUserPlus, FiClipboard, FiFileText, FiActivity, FiChevronRight } from "react-icons/fi";

const mockTeams = [
  { id: 1, name: "Alpha Team" },
  { id: 2, name: "Beta Team" },
  { id: 3, name: "Gamma Team" },
];
const mockTeamMembers = {
  1: [
    { id: 1, name: "John Doe", role: "Sales Manager" },
    { id: 2, name: "Jane Smith", role: "Account Executive" },
    { id: 3, name: "Mike Johnson", role: "Customer Success" },
    { id: 4, name: "Sarah Wilson", role: "Support Lead" },
  ],
  2: [
    { id: 1, name: "Alice Brown", role: "Team Lead" },
    { id: 2, name: "Bob White", role: "Analyst" },
  ],
  3: [
    { id: 1, name: "Charlie Green", role: "Manager" },
  ],
};
const mockActivityByTeam = {
  1: [
    { id: 1, type: "note", text: "Added note to ACME Corp deal.", time: "2h ago" },
    { id: 2, type: "upload", text: "Uploaded contract for Beta Ltd.", time: "5h ago" },
    { id: 3, type: "update", text: "Moved Gamma Inc to Qualified stage.", time: "1d ago" },
  ],
  2: [
    { id: 1, type: "note", text: "Beta: Added new lead.", time: "3h ago" },
  ],
  3: [
    { id: 1, type: "update", text: "Gamma: Updated dashboard.", time: "4h ago" },
  ],
};

export default function Workspace() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [teams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const teamMembers = mockTeamMembers[selectedTeam] || [];
  const mockActivity = mockActivityByTeam[selectedTeam] || [];

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
      <main className={`flex-1 flex flex-col px-4 py-10 transition-all duration-300 ${isMenuOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}>
        <h1 className="text-3xl font-bold text-white mb-4 mt-4 text-center flex items-center gap-2">
          <FiClipboard className="w-8 h-8 text-blue-400" /> Workspace
        </h1>
        {/* Team Selector below Workspace header */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-6 py-3 flex items-center gap-3 shadow">
            <span className="text-white font-medium text-base">Team:</span>
            <select
              className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-6 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-semibold shadow-md hover:border-blue-400 hover:from-blue-800 hover:to-blue-600 cursor-pointer"
              value={selectedTeam}
              onChange={e => setSelectedTeam(Number(e.target.value))}
            >
              {teams.map(team => (
                <option key={team.id} value={team.id} className="bg-[#1e293b] text-white">{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
          {/* Team Members */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold text-lg flex items-center gap-2"><FiUsers className="w-5 h-5 text-blue-400" /> Team</span>
              <button className="text-blue-400 hover:text-blue-300 text-xs font-medium" onClick={() => setShowTeam(true)}>View All</button>
            </div>
            <ul className="space-y-2">
              {teamMembers.slice(0, 3).map(m => (
                <li key={m.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-white font-bold text-lg">{m.name[0]}</div>
                  <div>
                    <span className="text-white font-medium">{m.name}</span>
                    <span className="block text-xs text-gray-400">{m.role}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"><FiUserPlus className="w-4 h-4" /> Add Member</button>
          </div>
          {/* Quick Actions */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-6 flex flex-col gap-4">
            <span className="text-white font-semibold text-lg mb-2 flex items-center gap-2"><FiFileText className="w-5 h-5 text-blue-400" /> Quick Actions</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"><FiClipboard className="w-4 h-4" /> Add Note</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"><FiFileText className="w-4 h-4" /> Upload Document</button>
          </div>
          {/* Recent Activity */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold text-lg flex items-center gap-2"><FiActivity className="w-5 h-5 text-blue-400" /> Recent Activity</span>
              <button className="text-blue-400 hover:text-blue-300 text-xs font-medium" onClick={() => setShowActivity(true)}>View All</button>
            </div>
            <ul className="space-y-2">
              {mockActivity.slice(0, 3).map(a => (
                <li key={a.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-white font-bold text-lg">
                    {a.type === "note" ? <FiClipboard /> : a.type === "upload" ? <FiFileText /> : <FiActivity />}
                  </div>
                  <div>
                    <span className="text-white font-medium">{a.text}</span>
                    <span className="block text-xs text-gray-400">{a.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Dashboard Summary */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-8 flex flex-col items-center mb-8">
          <span className="text-white font-semibold text-lg mb-2">Workspace Dashboard</span>
          <div className="w-full h-40 bg-[#273549] rounded-lg flex items-center justify-center text-gray-400 text-xl">
            [Workspace Summary & Charts Placeholder]
          </div>
        </div>
        {/* Team Modal */}
        {showTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155] relative">
              <button onClick={() => setShowTeam(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiChevronRight className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-white mb-6">Team Members</h2>
              <ul className="space-y-3">
                {mockTeam.map(m => (
                  <li key={m.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-white font-bold text-lg">{m.name[0]}</div>
                    <div>
                      <span className="text-white font-medium">{m.name}</span>
                      <span className="block text-xs text-gray-400">{m.role}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* Activity Modal */}
        {showActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155] relative">
              <button onClick={() => setShowActivity(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiChevronRight className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              <ul className="space-y-3">
                {mockActivity.map(a => (
                  <li key={a.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-white font-bold text-lg">
                      {a.type === "note" ? <FiClipboard /> : a.type === "upload" ? <FiFileText /> : <FiActivity />}
                    </div>
                    <div>
                      <span className="text-white font-medium">{a.text}</span>
                      <span className="block text-xs text-gray-400">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
