import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaUser, FaClock } from "react-icons/fa";
import { MdBusiness, MdDesignServices } from "react-icons/md";

const featureLabels = {
  feedback: "Feedback",
  dashboard: "Dashboard",
  ticketing: "Ticketing",
  customerChat: "Customer Chat",
  orders: "Orders",
  analytics: "Analytics",
  reports: "Reports",
  support: "Support"
};

export default function ClientCard({ client, onEdit, onDelete, onToggleStatus }) {
  const {
    clientName,
    clientType,
    username,
    features,
    isActive,
    createdAt
  } = client;

  const activeFeatures = Object.entries(features).filter(([_, enabled]) => enabled);
  const createdDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className={`bg-[#1e293b] rounded-xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
      isActive ? 'border-gray-700 hover:border-blue-500/50' : 'border-red-500/30 opacity-75'
    }`}>
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
        
        {/* Status Toggle */}
        <button
          onClick={onToggleStatus}
          className={`p-2 rounded-lg transition-colors ${
            isActive 
              ? "text-green-400 hover:bg-green-500/20" 
              : "text-red-400 hover:bg-red-500/20"
          }`}
          title={isActive ? "Active - Click to deactivate" : "Inactive - Click to activate"}
        >
          {isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
        </button>
      </div>

      {/* Username */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-gray-800/50 rounded-lg">
        <FaUser className="text-gray-400" />
        <span className="text-gray-300 font-mono text-sm">{username}</span>
      </div>

      {/* Features */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Enabled Features</h4>
        {activeFeatures.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeFeatures.slice(0, 4).map(([featureKey]) => (
              <span
                key={featureKey}
                className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full"
              >
                {featureLabels[featureKey]}
              </span>
            ))}
            {activeFeatures.length > 4 && (
              <span className="px-2 py-1 text-xs bg-gray-600/50 text-gray-300 rounded-full">
                +{activeFeatures.length - 4} more
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No features enabled</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <FaClock />
          <span>Created {createdDate}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
            title="Edit client"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Delete client"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
