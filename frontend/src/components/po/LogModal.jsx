import { FaTimes, FaClock, FaUser, FaBuilding, FaCube, FaNetworkWired, 
         FaDesktop, FaMapMarkerAlt, FaCode, FaCopy, FaCheck } from "react-icons/fa";
import { useState } from "react";

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

export default function LogModal({ log, isOpen, onClose }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !log) return null;

  const config = statusConfig[log.status];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZoneName: 'short'
      })
    };
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatted = formatTimestamp(log.timestamp);

  const renderCopyableField = (label, value, field, icon) => (
    <div className="flex items-start justify-between group">
      <div className="flex items-center gap-3 flex-1">
        {icon}
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">{label}</div>
          <div className="text-white font-mono text-sm break-all">{value}</div>
        </div>
      </div>
      <button
        onClick={() => copyToClipboard(value, field)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-3 p-2 hover:bg-gray-700 rounded-lg"
        title="Copy to clipboard"
      >
        {copiedField === field ? (
          <FaCheck className="text-green-400" size={14} />
        ) : (
          <FaCopy className="text-gray-400" size={14} />
        )}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
              log.status === 'success' ? 'bg-green-500' :
              log.status === 'error' ? 'bg-red-500' :
              log.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}></div>
            <h2 className="text-lg sm:text-xl font-semibold text-white truncate">Log Details</h2>
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${config.bgColor} ${config.color}`}>
              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-2"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Basic Information */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-[#0f172a] rounded-lg p-3 sm:p-4 border border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaClock className="text-blue-400 flex-shrink-0" />
                  <span className="truncate">Basic Information</span>
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Event</div>
                    <div className="text-white font-semibold text-sm sm:text-base break-words">{log.event}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Timestamp</div>
                    <div className="text-white">
                      <div className="font-medium text-sm sm:text-base">{formatted.date}</div>
                      <div className="text-xs sm:text-sm text-gray-300 font-mono">{formatted.time}</div>
                    </div>
                  </div>

                  {renderCopyableField(
                    "Log ID", 
                    log.id, 
                    "id",
                    <FaCode className="text-purple-400" size={16} />
                  )}
                </div>
              </div>

              {/* Client & Module Information */}
              <div className="bg-[#0f172a] rounded-lg p-3 sm:p-4 border border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaBuilding className="text-green-400 flex-shrink-0" />
                  <span className="truncate">Client & Module</span>
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Client Name</div>
                    <div className="text-white font-medium text-sm sm:text-base break-words">{log.clientName}</div>
                  </div>

                  {renderCopyableField(
                    "Client ID", 
                    log.clientId, 
                    "clientId",
                    <FaBuilding className="text-blue-400" size={16} />
                  )}

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Module</div>
                    <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-full">
                      {log.module}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User & Technical Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* User Information */}
              <div className="bg-[#0f172a] rounded-lg p-3 sm:p-4 border border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaUser className="text-yellow-400 flex-shrink-0" />
                  <span className="truncate">Triggered By</span>
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{roleIcons[log.triggeredBy.role]}</span>
                    <div className="min-w-0">
                      <div className="text-white font-medium text-sm sm:text-base truncate">{log.triggeredBy.username}</div>
                      <div className="text-sm text-gray-400 capitalize">{log.triggeredBy.role}</div>
                    </div>
                  </div>

                  {renderCopyableField(
                    "User ID", 
                    log.triggeredBy.id, 
                    "userId",
                    <FaUser className="text-purple-400" size={16} />
                  )}
                </div>
              </div>

              {/* Technical Information */}
              <div className="bg-[#0f172a] rounded-lg p-3 sm:p-4 border border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FaNetworkWired className="text-red-400 flex-shrink-0" />
                  <span className="truncate">Technical Details</span>
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {renderCopyableField(
                    "IP Address", 
                    log.ipAddress, 
                    "ip",
                    <FaNetworkWired className="text-green-400" size={16} />
                  )}

                  {renderCopyableField(
                    "User Agent", 
                    log.userAgent, 
                    "userAgent",
                    <FaDesktop className="text-blue-400" size={16} />
                  )}

                  {log.location && renderCopyableField(
                    "Location", 
                    log.location, 
                    "location",
                    <FaMapMarkerAlt className="text-yellow-400" size={16} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Details */}
          <div className="mt-4 sm:mt-6 bg-[#0f172a] rounded-lg p-3 sm:p-4 border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Event Details</h3>
            <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-gray-600">
              <pre className="text-gray-300 text-xs sm:text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                {log.details}
              </pre>
            </div>
          </div>

          {/* Additional Context */}
          {log.context && (
            <div className="mt-4 sm:mt-6 bg-[#0f172a] rounded-lg p-3 sm:p-4 border border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Additional Context</h3>
              <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-gray-600">
                <pre className="text-gray-300 text-xs sm:text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                  {JSON.stringify(log.context, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-t border-gray-700 bg-[#0f172a]">
          <div className="text-xs sm:text-sm text-gray-400">
            Log entry from {formatted.date}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
