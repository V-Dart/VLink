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
      <main className="flex-1 flex flex-col items-center justify-center px-4 ml-[60px]">
        <h1 className="text-2xl font-semibold mb-4 text-white text-center font-sans">Product Owner - Dashboard</h1>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-10">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`relative group flex flex-col items-center p-8 rounded-2xl shadow-2xl border border-gray-800 bg-gradient-to-br ${stat.color} hover:scale-[1.06] hover:shadow-3xl transition-all duration-300 cursor-pointer perspective-800`}
              style={{ minHeight: 180 }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(-1)}
            >
              <div className="mb-2 drop-shadow-xl">{stat.icon}</div>
              <span className="text-4xl font-extrabold text-white mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{stat.value}</span>
              {/* Animated title reveal */}
              <span className={`absolute left-1/2 -translate-x-1/2 bottom-6 px-4 py-2 rounded-lg bg-black/70 text-white text-base font-semibold shadow-lg transition-all duration-300 ${hovered === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} pointer-events-none`}>{stat.label}</span>
            </div>
          ))}
        </div>
        {/* Animated Bar Chart */}
        <div className="w-full max-w-3xl bg-[#181f2e] rounded-2xl p-8 border border-gray-800 shadow-2xl flex flex-col items-center">
          <h2 className="text-lg font-semibold text-white mb-6 font-sans">Weekly Issue Activity</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} className="font-sans">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a21caf" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={14} tickLine={false} axisLine={false} />
              <YAxis stroke="#cbd5e1" fontSize={14} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#181f2e', border: 'none', borderRadius: 8, color: '#fff' }} cursor={{ fill: '#33415533' }} />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Bar dataKey="issues" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
} 