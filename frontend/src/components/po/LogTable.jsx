import { FaEye, FaClock, FaUser, FaBuilding, FaCube } from "react-icons/fa";

const statusConfig = {
  success: {
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30"
  },
  error: {
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30"
  },
  warning: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30"
  },
  info: {
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30"
  }
};

const roleIcons = {
  admin: "👨‍💼",
  client: "🏢",
  customer: "👤",
  system: "🤖"
};

export default function LogTable({ logs, onViewLog, loading, isLiveView }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-16">
        <FaClock className="text-6xl text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No logs found</h3>
        <p className="text-gray-500">
          No log entries match your current search and filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Live indicator */}
      {isLiveView && (
        <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 border-b border-gray-700 bg-green-500/10">
          <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live monitoring active</span>
          </div>
        </div>
      )}
      
      <div className="hidden md:block">
        <table className="min-w-full">
          <thead className="bg-[#0f172a]">
            <tr>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaClock />
                  Timestamp
                </div>
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Event
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaBuilding />
                  Client
                </div>
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaCube />
                  Module
                </div>
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FaUser />
                  Triggered By
                </div>
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {logs.map((log, index) => {
              const config = statusConfig[log.status];
              const isRecent = index < 3 && isLiveView;
              
              return (
                <tr 
                  key={log.id} 
                  className={`hover:bg-[#334155]/50 transition-colors duration-200 ${
                    isRecent ? 'bg-blue-500/5 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs lg:text-sm">{formatTimestamp(log.timestamp)}</span>
                      {isRecent && (
                        <span className="text-xs text-blue-400 font-medium">New</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 lg:px-6 py-4 text-sm text-white">
                    <div className="font-medium">{log.event}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {truncateText(log.details, 40)}
                    </div>
                  </td>
                  
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="font-medium">{log.clientName}</div>
                    <div className="text-xs text-gray-500">ID: {log.clientId}</div>
                  </td>
                  
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                      {log.module}
                    </span>
                  </td>
                  
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="text-base lg:text-lg">{roleIcons[log.triggeredBy.role]}</span>
                      <div>
                        <div className="font-medium text-xs lg:text-sm">{log.triggeredBy.username}</div>
                        <div className="text-xs text-gray-500 capitalize">{log.triggeredBy.role}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        log.status === 'success' ? 'bg-green-500' :
                        log.status === 'error' ? 'bg-red-500' :
                        log.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                  
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onViewLog(log)}
                      className="flex items-center gap-2 px-2 lg:px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs"
                      title="View log details"
                    >
                      <FaEye size={12} />
                      <span className="hidden lg:inline">View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="space-y-3 p-3">
          {logs.map((log, index) => {
            const config = statusConfig[log.status];
            const isRecent = index < 3 && isLiveView;
            
            return (
              <div 
                key={log.id} 
                className={`bg-[#334155]/30 rounded-lg p-4 border border-gray-600 ${
                  isRecent ? 'border-l-4 border-l-blue-500 bg-blue-500/5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{log.event}</h3>
                      {isRecent && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">New</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      log.status === 'success' ? 'bg-green-500' :
                      log.status === 'error' ? 'bg-red-500' :
                      log.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                  <div>
                    <div className="text-gray-400 mb-1">Client</div>
                    <div className="text-white font-medium">{log.clientName}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Module</div>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      {log.module}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-base">{roleIcons[log.triggeredBy.role]}</span>
                    <span className="text-gray-300">{log.triggeredBy.username}</span>
                    <span className="text-gray-500 capitalize">({log.triggeredBy.role})</span>
                  </div>
                  
                  <button
                    onClick={() => onViewLog(log)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs"
                  >
                    <FaEye size={12} />
                    View
                  </button>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <div className="text-xs text-gray-400">
                    {truncateText(log.details, 60)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Table footer with entry count */}
      <div className="px-3 sm:px-4 md:px-6 py-3 border-t border-gray-700 bg-[#0f172a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-400">
          <span>Showing {logs.length} log entries</span>
          {isLiveView && (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Updates every 5 seconds</span>
              <span className="sm:hidden">Live updates</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
