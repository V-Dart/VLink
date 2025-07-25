import { FaDatabase, FaEye, FaExclamationTriangle, FaClock, FaUsers, FaTable } from "react-icons/fa";
import { SiMongodb, SiPostgresql, SiFirebase, SiMysql } from "react-icons/si";
import { MdBusiness, MdDesignServices } from "react-icons/md";

const dbIcons = {
  "MongoDB": <SiMongodb className="text-green-500" />,
  "PostgreSQL": <SiPostgresql className="text-blue-500" />,
  "Firebase": <SiFirebase className="text-orange-500" />,
  "MySQL": <SiMysql className="text-blue-600" />
};

const statusConfig = {
  healthy: {
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30"
  },
  warning: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30"
  },
  critical: {
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30"
  }
};

export default function DatabaseCard({ client, onViewSchema }) {
  const {
    clientName,
    clientType,
    dbType,
    usedStorage,
    totalStorage,
    storagePercentage,
    status,
    tables,
    connectionStatus,
    lastBackup,
    updatedAt
  } = client;

  const config = statusConfig[status];
  const dbIcon = dbIcons[dbType] || <FaDatabase className="text-gray-400" />;
  
  // Calculate total records across all tables
  const totalRecords = Object.values(tables).reduce((sum, table) => sum + table.count, 0);
  
  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`bg-[#1e293b] rounded-xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${config.borderColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            clientType === "Product-based" 
              ? "bg-purple-500/20 text-purple-400" 
              : "bg-orange-500/20 text-orange-400"
          }`}>
            {clientType === "Product-based" ? <MdBusiness size={20} /> : <MdDesignServices size={20} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white truncate">{clientName}</h3>
            <p className="text-sm text-gray-400">{clientType}</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor}`}>
          {status === 'critical' && <FaExclamationTriangle className={`${config.color} animate-pulse`} />}
          {status === 'warning' && <FaExclamationTriangle className={config.color} />}
          <span className={`text-xs font-medium ${config.color}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {/* Database Info */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-gray-800/50 rounded-lg">
        {dbIcon}
        <span className="text-white font-medium">{dbType}</span>
        <div className={`ml-auto w-2 h-2 rounded-full ${
          connectionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
      </div>

      {/* Storage Usage */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Storage Usage</span>
          <span className={`text-sm font-bold ${config.color}`}>
            {usedStorage.toFixed(1)}GB / {totalStorage.toFixed(1)}GB
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              status === 'critical' ? 'bg-red-500' :
              status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${storagePercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-1">{storagePercentage}% used</p>
      </div>

      {/* Schema Overview */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <FaTable />
          Schema Overview
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Total Records:</span>
            <span className="text-white font-medium">{totalRecords.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Tables/Collections:</span>
            <span className="text-white font-medium">{Object.keys(tables).length}</span>
          </div>
        </div>
        
        {/* Top Tables */}
        <div className="mt-3 space-y-1">
          {Object.entries(tables)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 3)
            .map(([tableName, tableData]) => (
              <div key={tableName} className="flex items-center justify-between text-xs">
                <span className="text-blue-300 capitalize">{tableName}:</span>
                <span className="text-gray-300">{tableData.count.toLocaleString()}</span>
              </div>
            ))}
          {Object.keys(tables).length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{Object.keys(tables).length - 3} more tables
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaClock />
            <span>Updated: {formatDate(updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Backup: {formatDate(lastBackup)}</span>
          </div>
        </div>
        
        <button
          onClick={onViewSchema}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          <FaEye size={12} />
          Schema
        </button>
      </div>
    </div>
  );
}
