import { FaEdit, FaTrash, FaClock, FaUser, FaBuilding, FaTag, FaComments } from "react-icons/fa";
import { useState } from "react";

const priorityColors = {
  Critical: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
  High: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
  Medium: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  Low: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" }
};

const statusColors = {
  Open: { bg: "bg-red-500/20", text: "text-red-400" },
  "In Progress": { bg: "bg-blue-500/20", text: "text-blue-400" },
  Resolved: { bg: "bg-green-500/20", text: "text-green-400" },
  Reopened: { bg: "bg-purple-500/20", text: "text-purple-400" }
};

const categoryColors = {
  Login: "bg-red-500/20 text-red-300",
  "UI Bug": "bg-orange-500/20 text-orange-300",
  Database: "bg-purple-500/20 text-purple-300",
  Integration: "bg-cyan-500/20 text-cyan-300",
  "Access Control": "bg-pink-500/20 text-pink-300",
  Email: "bg-green-500/20 text-green-300"
};

export default function IssueCard({ issue, onEdit, onDelete, onStatusChange, teamMembers }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(issue.assignedTo);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getSLAStatus = () => {
    const createdDate = new Date(issue.createdAt);
    const now = new Date();
    const hoursElapsed = (now - createdDate) / (1000 * 60 * 60);
    
    const slaHours = {
      Critical: 4,
      High: 24,
      Medium: 72,
      Low: 168
    };
    
    const slaLimit = slaHours[issue.priority];
    const remainingHours = slaLimit - hoursElapsed;
    
    return {
      isOverdue: remainingHours <= 0,
      hoursRemaining: Math.max(0, Math.floor(remainingHours)),
      percentage: Math.min(100, (hoursElapsed / slaLimit) * 100)
    };
  };

  const sla = getSLAStatus();
  const priorityConfig = priorityColors[issue.priority];
  const statusConfig = statusColors[issue.status];

  const handleAssigneeChange = (e) => {
    const newAssignee = e.target.value;
    setSelectedAssignee(newAssignee);
    // Here you would typically update the issue
    // For now, we'll just update the local state
  };

  const handleStatusToggle = () => {
    const newStatus = issue.status === "Resolved" ? "Open" : "Resolved";
    onStatusChange(issue.id, newStatus);
  };

  return (
    <div className="p-4 sm:p-6 hover:bg-[#334155]/30 transition-colors">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-white truncate">{issue.title}</h3>
              <span className="text-xs text-gray-400 font-mono">{issue.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[issue.category] || 'bg-gray-500/20 text-gray-300'}`}>
                {issue.category}
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-2">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {isExpanded ? issue.description : `${issue.description.substring(0, 120)}${issue.description.length > 120 ? '...' : ''}`}
                </p>
                {issue.description.length > 120 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-400 text-xs mt-1 hover:text-blue-300"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FaBuilding className="text-gray-400" />
                  <span className="text-white font-medium">{issue.clientName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaUser className="text-gray-400" />
                  <span className="text-gray-300">{issue.reportedBy}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaClock className="text-gray-400" />
                  <span className="text-gray-300">{formatDate(issue.createdAt)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
                    {issue.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                    {issue.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Assigned To:</label>
                  <select
                    value={selectedAssignee}
                    onChange={handleAssigneeChange}
                    className="w-full px-2 py-1 bg-[#0f172a] border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>
                
                {issue.status !== "Resolved" && sla && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">SLA</span>
                      <span className={sla.isOverdue ? "text-red-400" : "text-gray-300"}>
                        {sla.isOverdue ? "Overdue" : `${sla.hoursRemaining}h left`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${sla.isOverdue ? 'bg-red-500' : sla.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, sla.percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {issue.comments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaComments />
                <span>{issue.comments.length} comment{issue.comments.length !== 1 ? 's' : ''}</span>
                <span>• Last: {issue.comments[issue.comments.length - 1].author}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleStatusToggle}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                issue.status === "Resolved" 
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {issue.status === "Resolved" ? "Reopen" : "Resolve"}
            </button>
            <button
              onClick={() => onEdit(issue)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Edit issue"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(issue.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete issue"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white mb-1">{issue.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400 font-mono">{issue.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[issue.category] || 'bg-gray-500/20 text-gray-300'}`}>
                  {issue.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
                {issue.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                {issue.status}
              </span>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm">
            {isExpanded ? issue.description : `${issue.description.substring(0, 100)}${issue.description.length > 100 ? '...' : ''}`}
          </p>
          {issue.description.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 text-xs hover:text-blue-300"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-gray-400 mb-1">Client</div>
              <div className="text-white font-medium">{issue.clientName}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Reported By</div>
              <div className="text-gray-300">{issue.reportedBy}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Created</div>
              <div className="text-gray-300">{formatDate(issue.createdAt)}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Assigned To</div>
              <select
                value={selectedAssignee}
                onChange={handleAssigneeChange}
                className="w-full px-2 py-1 bg-[#0f172a] border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {teamMembers.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
          </div>
          
          {issue.status !== "Resolved" && sla && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">SLA Status</span>
                <span className={sla.isOverdue ? "text-red-400" : "text-gray-300"}>
                  {sla.isOverdue ? "Overdue" : `${sla.hoursRemaining}h remaining`}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${sla.isOverdue ? 'bg-red-500' : sla.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, sla.percentage)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-600">
            {issue.comments.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaComments />
                <span>{issue.comments.length} comment{issue.comments.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleStatusToggle}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  issue.status === "Resolved" 
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {issue.status === "Resolved" ? "Reopen" : "Resolve"}
              </button>
              <button
                onClick={() => onEdit(issue)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="Edit issue"
              >
                <FaEdit size={14} />
              </button>
              <button
                onClick={() => onDelete(issue.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete issue"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
