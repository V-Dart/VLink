import { useState } from "react";
import Sidebar from "../../components/po/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const stats = [
  {
    label: "Total Clients",
    value: 128,
    color: "from-blue-500 to-blue-700",
    icon: (
      <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ),
  },
  {
    label: "Open Issues",
    value: 12,
    color: "from-red-500 to-pink-600",
    icon: (
      <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z" /></svg>
    ),
  },
  {
    label: "Resolved Issues",
    value: 34,
    color: "from-green-500 to-teal-600",
    icon: (
      <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
  },
];

const chartData = [
  { name: 'Mon', issues: 60 },
  { name: 'Tue', issues: 90 },
  { name: 'Wed', issues: 40 },
  { name: 'Thu', issues: 80 },
  { name: 'Fri', issues: 55 },
  { name: 'Sat', issues: 100 },
  { name: 'Sun', issues: 70 },
];

export default function PODashboard() {
  const [hovered, setHovered] = useState(-1);

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-4 sm:py-6 ml-[60px]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-white text-center font-sans">VLink Product Owner - Dashboard</h1>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 w-full max-w-6xl">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${stat.color} p-4 sm:p-6 rounded-xl shadow-lg transform transition-all duration-300 ${
                hovered === index ? 'scale-105' : 'scale-100'
              } cursor-pointer`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(-1)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs sm:text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Animated Bar Chart */}
        <div className="w-full max-w-4xl bg-[#181f2e] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800 shadow-2xl flex flex-col items-center">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-4 sm:mb-6 font-sans text-center">Weekly Issue Activity</h2>
          <div className="w-full h-48 sm:h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} className="font-sans">
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a21caf" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#cbd5e1" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#cbd5e1" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#181f2e', 
                    border: 'none', 
                    borderRadius: 8, 
                    color: '#fff',
                    fontSize: '14px'
                  }} 
                  cursor={{ fill: '#33415533' }} 
                />
                <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="issues" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
} 