import { FaBug, FaExclamationTriangle, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function IssueStats({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
      {/* Total Issues */}
      <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaBug className="text-blue-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Total Issues</p>
          </div>
        </div>
      </div>

      {/* Open Issues */}
      <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaExclamationTriangle className="text-red-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-red-400">{stats.open}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Open</p>
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaClock className="text-yellow-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
            <p className="text-gray-400 text-xs sm:text-sm">In Progress</p>
          </div>
        </div>
      </div>

      {/* Resolved */}
      <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaCheckCircle className="text-green-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.resolved}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Resolved</p>
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700 col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaExclamationCircle className="text-purple-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-bold text-purple-400">{stats.critical}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Critical</p>
          </div>
        </div>
      </div>
    </div>
  );
}
