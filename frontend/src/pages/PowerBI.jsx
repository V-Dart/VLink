import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import { FiBarChart2, FiTrendingUp, FiUsers, FiFileText, FiPieChart, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const mockTeams = [
  { id: 1, name: "Alpha Team" },
  { id: 2, name: "Beta Team" },
  { id: 3, name: "Gamma Team" },
];
const kpisByTeam = {
  1: [
    { label: "Total Revenue", value: "$1,200,000", icon: <FiTrendingUp className="w-6 h-6 text-green-400" />, trend: "+8% MoM", positive: true },
    { label: "Active Customers", value: "320", icon: <FiUsers className="w-6 h-6 text-blue-400" />, trend: "+12", positive: true },
    { label: "Open Deals", value: "45", icon: <FiFileText className="w-6 h-6 text-yellow-400" />, trend: "-3", positive: false },
    { label: "Avg. Deal Size", value: "$18,500", icon: <FiPieChart className="w-6 h-6 text-purple-400" />, trend: "+2%", positive: true },
  ],
  2: [
    { label: "Total Revenue", value: "$800,000", icon: <FiTrendingUp className="w-6 h-6 text-green-400" />, trend: "+5% MoM", positive: true },
    { label: "Active Customers", value: "210", icon: <FiUsers className="w-6 h-6 text-blue-400" />, trend: "+7", positive: true },
    { label: "Open Deals", value: "28", icon: <FiFileText className="w-6 h-6 text-yellow-400" />, trend: "+2", positive: true },
  ],
  3: [
    { label: "Total Revenue", value: "$950,000", icon: <FiTrendingUp className="w-6 h-6 text-green-400" />, trend: "+6% MoM", positive: true },
    { label: "Active Customers", value: "180", icon: <FiUsers className="w-6 h-6 text-blue-400" />, trend: "+5", positive: true },
    { label: "Open Deals", value: "35", icon: <FiFileText className="w-6 h-6 text-yellow-400" />, trend: "-1", positive: false },
    { label: "Avg. Deal Size", value: "$27,000", icon: <FiPieChart className="w-6 h-6 text-purple-400" />, trend: "+3%", positive: true },
  ],
};

export default function PowerBI() {
  const [isPermanent, setPermanent] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [teams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const kpis = kpisByTeam[selectedTeam] || [];
  const reportsByTeam = {
    1: [
      { id: 1, title: "Monthly Sales Overview", date: "2024-06-01", link: "#" },
      { id: 2, title: "Customer Churn Analysis", date: "2024-06-05", link: "#" },
      { id: 3, title: "Pipeline Conversion Rates", date: "2024-06-10", link: "#" },
    ],
    2: [
      { id: 1, title: "Beta: Revenue Breakdown", date: "2024-06-03", link: "#" },
      { id: 2, title: "Beta: Customer Feedback", date: "2024-06-07", link: "#" },
    ],
    3: [
      { id: 1, title: "Gamma: Market Share", date: "2024-06-02", link: "#" },
      { id: 2, title: "Gamma: Win/Loss Analysis", date: "2024-06-08", link: "#" },
    ],
  };
  const mockReports = reportsByTeam[selectedTeam] || [];

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
          <FiBarChart2 className="w-8 h-8 text-blue-400" /> Analytics & PowerBI
        </h1>
        {/* Team Selector below header */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-6 py-3 flex items-center gap-3 shadow">
            <span className="text-white font-medium text-base">Team:</span>
            <select
              className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-6 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-semibold shadow-md hover:border-blue-400 hover:from-blue-800 hover:to-blue-600 cursor-pointer"
              value={selectedTeam}
              onChange={e => setSelectedTeam(Number(e.target.value))}
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">{kpi.icon}<span className="text-white font-semibold text-lg">{kpi.value}</span></div>
              <span className="text-xs text-gray-400">{kpi.label}</span>
              <span className={`text-xs font-bold flex items-center gap-1 ${kpi.positive ? 'text-green-400' : 'text-red-400'}`}>{kpi.positive ? <FiArrowUpRight /> : <FiArrowDownRight />}{kpi.trend}</span>
            </div>
          ))}
        </div>
        {/* Embedded PowerBI/BI Dashboard (mock) */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-8 mb-8 flex flex-col items-center">
          <span className="text-white font-semibold text-lg mb-2">Embedded PowerBI Dashboard</span>
          <div className="w-full h-64 bg-[#273549] rounded-lg flex items-center justify-center text-gray-400 text-xl">
            [PowerBI/BI Dashboard Placeholder]
          </div>
        </div>
        {/* Recent Reports */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-6">
          <span className="text-white font-semibold text-lg mb-4 block">Recent Reports</span>
          <ul className="divide-y divide-[#334155]">
            {mockReports.map(r => (
              <li key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">{r.title}</span>
                  <span className="block text-xs text-gray-400">{r.date}</span>
                </div>
                <a href={r.link} className="text-blue-400 hover:underline text-sm font-medium">View</a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
