import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaPlus } from "react-icons/fa";

const priorityOptions = [
  { value: "Low", label: "Low", color: "text-green-400" },
  { value: "Medium", label: "Medium", color: "text-yellow-400" },
  { value: "High", label: "High", color: "text-orange-400" },
  { value: "Critical", label: "Critical", color: "text-red-400" }
];

const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "Reopened", label: "Reopened" }
];

const categoryOptions = [
  "Login",
  "UI Bug", 
  "Database",
  "Integration",
  "Access Control",
  "Email",
  "Performance",
  "Security",
  "API",
  "Authentication",
  "Authorization",
  "Data Sync"
];

export default function IssueModal({ isOpen, issue, isCreating, onClose, onSave, teamMembers, clients }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Login",
    priority: "Medium",
    status: "Open",
    clientName: "",
    reportedBy: "",
    assignedTo: teamMembers[0] || ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (issue && !isCreating) {
      setFormData({
        title: issue.title,
        description: issue.description,
        category: issue.category,
        priority: issue.priority,
        status: issue.status,
        clientName: issue.clientName,
        reportedBy: issue.reportedBy,
        assignedTo: issue.assignedTo
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Login",
        priority: "Medium",
        status: "Open",
        clientName: clients[0] || "",
        reportedBy: "",
        assignedTo: teamMembers[0] || ""
      });
    }
    setErrors({});
  }, [issue, isCreating, teamMembers, clients]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    
    if (!formData.reportedBy.trim()) {
      newErrors.reportedBy = "Reporter email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.reportedBy)) {
      newErrors.reportedBy = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {isCreating ? (
              <>
                <FaPlus className="text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Raise New Issue</h2>
              </>
            ) : (
              <>
                <FaSave className="text-green-400" />
                <h2 className="text-xl font-semibold text-white">Edit Issue</h2>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a descriptive title for the issue"
                className={`w-full px-3 py-2 bg-[#0f172a] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Provide detailed information about the issue, including steps to reproduce, expected vs actual behavior, and any error messages"
                className={`w-full px-3 py-2 bg-[#0f172a] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client and Reporter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client Name *
                </label>
                {isCreating ? (
                  <select
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-[#0f172a] border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.clientName ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-[#0f172a] border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.clientName ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                )}
                {errors.clientName && (
                  <p className="text-red-400 text-sm mt-1">{errors.clientName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reported By (Email) *
                </label>
                <input
                  type="email"
                  name="reportedBy"
                  value={formData.reportedBy}
                  onChange={handleInputChange}
                  placeholder="reporter@client.com"
                  className={`w-full px-3 py-2 bg-[#0f172a] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.reportedBy ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.reportedBy && (
                  <p className="text-red-400 text-sm mt-1">{errors.reportedBy}</p>
                )}
              </div>
            </div>

            {/* Status and Assigned To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {teamMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-t border-gray-700 bg-[#0f172a]">
          <div className="text-xs sm:text-sm text-gray-400">
            {isCreating ? "Create a new issue ticket" : "Update existing issue"}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors text-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  {isCreating ? "Create Issue" : "Update Issue"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
