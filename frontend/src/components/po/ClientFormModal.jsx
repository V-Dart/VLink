import { useState, useEffect } from "react";
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdBusiness, MdDesignServices } from "react-icons/md";

const availableFeatures = [
  { key: "feedback", label: "Feedback", description: "Allow clients to submit feedback" },
  { key: "dashboard", label: "Dashboard", description: "Access to main dashboard" },
  { key: "ticketing", label: "Ticketing", description: "Support ticket system" },
  { key: "customerChat", label: "Customer Chat", description: "Live chat support" },
  { key: "orders", label: "Orders", description: "Order management system" },
  { key: "analytics", label: "Analytics", description: "Analytics and insights" },
  { key: "reports", label: "Reports", description: "Generate and view reports" },
  { key: "support", label: "Support", description: "Access to support center" }
];

export default function ClientFormModal({ isOpen, client, onClose, onSave }) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientType: "Product-based",
    username: "",
    password: "",
    confirmPassword: "",
    features: {
      feedback: false,
      dashboard: true,
      ticketing: false,
      customerChat: false,
      orders: false,
      analytics: false,
      reports: false,
      support: false
    },
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        password: "",
        confirmPassword: ""
      });
    } else {
      // Reset form for new client
      setFormData({
        clientName: "",
        clientType: "Product-based",
        username: "",
        password: "",
        confirmPassword: "",
        features: {
          feedback: false,
          dashboard: true,
          ticketing: false,
          customerChat: false,
          orders: false,
          analytics: false,
          reports: false,
          support: false
        },
        isActive: true
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!client && !formData.password) {
      newErrors.password = "Password is required";
    }
    if (!client && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Password strength (only for new clients or when password is provided)
    if ((!client || formData.password) && formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    // Username format
    if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      // Remove confirmPassword from submission
      delete submitData.confirmPassword;
      
      // If editing and no password provided, don't update password
      if (client && !formData.password) {
        delete submitData.password;
      }

      onSave(submitData);
    } catch (error) {
      console.error("Error saving client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureToggle = (featureKey) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: !prev.features[featureKey]
      }
    }));
  };

  const handleSelectAllFeatures = () => {
    const allEnabled = availableFeatures.every(feature => formData.features[feature.key]);
    const newFeatures = {};
    availableFeatures.forEach(feature => {
      newFeatures[feature.key] = !allEnabled;
    });
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {client ? "Edit Client" : "Add New Client"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className={`w-full px-4 py-3 bg-[#0f172a] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.clientName ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter client name"
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-400">{errors.clientName}</p>
              )}
            </div>

            {/* Client Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "Product-based", icon: <MdBusiness />, label: "Product-based" },
                  { value: "Service-based", icon: <MdDesignServices />, label: "Service-based" }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, clientType: type.value }))}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      formData.clientType === type.value
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-gray-600 hover:border-gray-500 text-gray-300"
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Account Credentials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Account Credentials</h3>
            
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username *
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 bg-[#0f172a] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.username ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password {!client && "*"}
                {client && <span className="text-gray-500 text-xs ml-2">(leave blank to keep current)</span>}
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full pl-10 pr-12 py-3 bg-[#0f172a] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            {(!client || formData.password) && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full pl-10 pr-12 py-3 bg-[#0f172a] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Feature Access</h3>
              <button
                type="button"
                onClick={handleSelectAllFeatures}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {availableFeatures.every(feature => formData.features[feature.key]) ? "Deselect All" : "Select All"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableFeatures.map((feature) => (
                <div
                  key={feature.key}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.features[feature.key]
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  onClick={() => handleFeatureToggle(feature.key)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{feature.label}</h4>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.features[feature.key]
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-400"
                    }`}>
                      {formData.features[feature.key] && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              {client ? "Update Client" : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
