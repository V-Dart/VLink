import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import {
  FaUpload,
  FaPalette,
  FaEye,
  FaGripVertical,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSave,
  FaCheck,
  FaCog,
  FaQuestion,
  FaTicketAlt,
  FaComments,
  FaHeadset,
  FaListUl,
  FaArrowUp,
  FaArrowDown,
  FaToggleOn,
  FaToggleOff,
  FaBuilding,
  FaShoppingCart,
  FaTools,
  FaClipboardList,
  FaPhone,
  FaEnvelope,
  FaWarehouse,
  FaTruck,
  FaChartLine,
  FaUsers,
  FaCreditCard,
  FaCalendarAlt
} from "react-icons/fa";

// ICONS mapping for dynamic icon rendering
const ICONS = {
  FaTools,
  FaCalendarAlt,
  FaCreditCard,
  FaComments,
  FaTicketAlt,
  FaQuestion,
  FaListUl,
  FaWarehouse,
  FaTruck,
  FaArrowDown,
  FaHeadset,
  FaShoppingCart,
  // Add more icons as needed
};

// Add color mapping for Tailwind-safe classes
const COLOR_CLASSES = {
  blue: { text: 'text-blue-400', bg: 'bg-blue-500' },
  green: { text: 'text-green-400', bg: 'bg-green-500' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500' },
  red: { text: 'text-red-400', bg: 'bg-red-500' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500' },
  teal: { text: 'text-teal-400', bg: 'bg-teal-500' },
};

// Preview Modal Component
function PreviewModal({ isOpen, onClose, config, companyType }) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // The onConfirm function was removed from props, so this block is effectively removed.
      // The modal will now only close on button click.
      onClose();
      setTimeout(() => {
        alert(`Configuration preview closed.`);
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const getEnabledSections = () => {
    return config.dashboardSections.filter(section => section.enabled);
  };

  const color = COLOR_CLASSES[config.branding.primaryColor] || COLOR_CLASSES.blue;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">Preview Customer Dashboard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Preview Header */}
          <div className={`mb-6 p-4 ${color.bg} rounded-lg border border-gray-600`}>
            <div className="flex items-center gap-4 mb-4">
              {config.branding.logo && (
                <img src={config.branding.logo} alt="Logo" className="w-12 h-12 object-contain" />
              )}
              <div>
                <h1 className={`text-2xl font-bold ${color.text}`}>
                  {companyType === 'service' ? 'Service Portal' : 'Product Portal'}
                </h1>
                <p className="text-gray-300">{config.branding.welcomeMessage}</p>
              </div>
            </div>
          </div>

          {/* Preview Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {getEnabledSections().map((section) => {
              const IconComponent = ICONS[section.icon];
              return (
                <div key={section.id} className="bg-[#0f172a] p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-lg ${color.text}`}>
                      {IconComponent && <IconComponent />}
                    </span>
                    <h3 className="text-white font-medium">{section.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {section.name === 'Orders' && 'View and track your orders'}
                    {section.name === 'Feedback' && 'Share your feedback with us'}
                    {section.name === 'Help' && 'Get help and support'}
                    {section.name === 'Chat' && 'Live chat with our team'}
                    {section.name === 'Tickets' && 'Manage support tickets'}
                    {section.name === 'FAQs' && 'Frequently asked questions'}
                    {section.name === 'Service Requests' && 'Submit service requests'}
                    {section.name === 'Appointments' && 'Schedule appointments'}
                    {section.name === 'Billing' && 'View billing information'}
                    {section.name === 'Inventory' && 'Check product availability'}
                    {section.name === 'Shipping' && 'Track shipments'}
                    {section.name === 'Returns' && 'Process returns'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Preview Form Fields */}
          {config.formFields.length > 0 && (
            <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-600 mb-6">
              <h3 className="text-white font-medium mb-3">Contact Form Preview</h3>
              <div className="space-y-3">
                {config.formFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white" rows="2" disabled />
                    ) : field.type === 'dropdown' ? (
                      <select className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white" disabled>
                        <option>Select {field.label}</option>
                      </select>
                    ) : (
                      <input type={field.type} className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white" disabled />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview FAQs */}
          {config.faqs.length > 0 && (
            <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-600">
              <h3 className="text-white font-medium mb-3">FAQ Preview</h3>
              <div className="space-y-3">
                {config.faqs.slice(0, 2).map((faq) => (
                  <div key={faq.id}>
                    <h4 className="text-white font-medium">{faq.question}</h4>
                    <p className="text-gray-400 text-sm mt-1">{faq.answer}</p>
                  </div>
                ))}
                {config.faqs.length > 2 && (
                  <p className="text-gray-500 text-sm">... and {config.faqs.length - 2} more FAQs</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Customize Modal Component
function CustomizeModal({ isOpen, onClose, onSave, section, formData, setFormData }) {
  if (!isOpen || !section) return null;

  const addFormField = () => {
    const newField = {
      id: Date.now(),
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: []
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-600">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              {section.icon}
              Customize {section.name} Form
            </h2>
            <p className="text-gray-400 text-sm mt-1">Design the form that customers will see for {section.name.toLowerCase()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Form Title and Description */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Form Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter form title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter form description..."
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Form Fields</h3>
              <button
                onClick={addFormField}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus />
                Add Field
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.fields.map((field) => (
                <div key={field.id} className="bg-[#0f172a] p-4 rounded-lg border border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Field Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter field label..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Field Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value })}
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text">Text Input</option>
                        <option value="textarea">Text Area</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio Button</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Placeholder</label>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter placeholder text..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-300 text-sm">Required field</span>
                    </label>
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              {formData.fields.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No fields added yet. Click "Add Field" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Form Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Form Preview</h3>
            <div className="bg-[#0f172a] p-6 rounded-lg border border-gray-600">
              <h4 className="text-white font-semibold mb-2">{formData.title || 'Form Title'}</h4>
              <p className="text-gray-400 text-sm mb-4">{formData.description || 'Form description will appear here'}</p>
              
              <div className="space-y-4">
                {formData.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {field.label || 'Field Label'} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white"
                        placeholder={field.placeholder}
                        rows="3"
                        disabled
                      />
                    ) : field.type === 'dropdown' ? (
                      <select className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white" disabled>
                        <option>{field.placeholder || 'Select an option'}</option>
                      </select>
                    ) : (
                      <input 
                        type={field.type}
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white"
                        placeholder={field.placeholder}
                        disabled
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaSave />
            Save Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClientWorkspaceConfig() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [companyType, setCompanyType] = useState("service"); // service or product
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Branding state
  const [branding, setBranding] = useState({
    logo: null,
    primaryColor: "blue",
    welcomeMessage: "Welcome to your customer portal"
  });

  // Service-based dashboard sections
  const serviceSections = [
    { id: 1, name: "Service Requests", icon: "FaTools", enabled: true },
    { id: 2, name: "Appointments", icon: "FaCalendarAlt", enabled: true },
    { id: 3, name: "Billing", icon: "FaCreditCard", enabled: true },
    { id: 4, name: "Chat", icon: "FaComments", enabled: false },
    { id: 5, name: "Tickets", icon: "FaTicketAlt", enabled: true },
    { id: 6, name: "FAQs", icon: "FaQuestion", enabled: true }
  ];

  // Product-based dashboard sections
  const productSections = [
    { id: 1, name: "Orders", icon: "FaListUl", enabled: true },
    { id: 2, name: "Inventory", icon: "FaWarehouse", enabled: true },
    { id: 3, name: "Shipping", icon: "FaTruck", enabled: true },
    { id: 4, name: "Returns", icon: "FaArrowDown", enabled: false },
    { id: 5, name: "Support", icon: "FaHeadset", enabled: true },
    { id: 6, name: "FAQs", icon: "FaQuestion", enabled: true }
  ];

  // Dashboard sections state (dynamically set based on company type)
  const [dashboardSections, setDashboardSections] = useState(serviceSections);

  // Form fields state
  const [formFields, setFormFields] = useState([
    { id: 1, label: "Issue Type", type: "dropdown", required: true, options: ["Bug", "Feature Request", "Support"] },
    { id: 2, label: "Serial Number", type: "text", required: true, options: [] }
  ]);
  const [newField, setNewField] = useState({ label: "", type: "text", required: false });

  // FAQ state
  const [faqs, setFaqs] = useState([
    { id: 1, question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page." },
    { id: 2, question: "How do I submit a support ticket?", answer: "Navigate to the Support section and fill out the form." }
  ]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState(null);
  const [customizeSection, setCustomizeSection] = useState(null);
  const [customizeFormData, setCustomizeFormData] = useState({
    title: '',
    description: '',
    fields: [],
    settings: {}
  });

  // Load existing configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('clientWorkspaceConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setIsEditing(true);
        setCompanyType(config.companyType);
        setBranding(config.branding);
        setDashboardSections(config.dashboardSections);
        setFormFields(config.formFields);
        setFaqs(config.faqs);
      } catch (error) {
        console.error('Error loading saved configuration:', error);
      }
    }
  }, []);

  // Available colors for primary color picker
  const colors = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
    { name: "Teal", value: "teal", class: "bg-teal-500" }
  ];

  // Field types for form builder
  const fieldTypes = [
    { value: "text", label: "Text Input" },
    { value: "textarea", label: "Text Area" },
    { value: "dropdown", label: "Dropdown" },
    { value: "checkbox", label: "Checkbox" },
    { value: "radio", label: "Radio Button" },
    { value: "number", label: "Number" },
    { value: "email", label: "Email" },
    { value: "date", label: "Date" }
  ];

  // Company type toggle handler
  const toggleCompanyType = () => {
    const newType = companyType === "service" ? "product" : "service";
    setCompanyType(newType);
    setDashboardSections(newType === "service" ? serviceSections : productSections);
    
    // Update welcome message based on type
    setBranding(prev => ({
      ...prev,
      welcomeMessage: newType === "service" 
        ? "Welcome to your service portal" 
        : "Welcome to your product portal"
    }));
  };

  // Menu handlers
  const handleHamburgerHover = () => {
    if (!isPermanent) setMenuOpen(true);
  };
  const handleHamburgerLeave = () => {
    if (!isPermanent && !isHoveringMenu) setMenuOpen(false);
  };
  const handleHamburgerClick = () => {
    setPermanent((prev) => !prev);
    setMenuOpen((prev) => (!isPermanent ? true : false));
  };
  const handleMenuHover = () => {
    setIsHoveringMenu(true);
    if (!isPermanent) setMenuOpen(true);
  };
  const handleMenuLeave = () => {
    setIsHoveringMenu(false);
    if (!isPermanent) setMenuOpen(false);
  };

  // Branding handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBranding(prev => ({ ...prev, logo: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  // Dashboard section handlers
  const toggleSection = (id) => {
    setDashboardSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const moveSectionUp = (id) => {
    setDashboardSections(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index > 0) {
        const newSections = [...prev];
        [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
        return newSections;
      }
      return prev;
    });
  };

  const moveSectionDown = (id) => {
    setDashboardSections(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index < prev.length - 1) {
        const newSections = [...prev];
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        return newSections;
      }
      return prev;
    });
  };

  // Form field handlers
  const addFormField = () => {
    if (newField.label.trim()) {
      setFormFields(prev => [
        ...prev,
        { ...newField, id: Date.now(), options: newField.type === "dropdown" ? ["Option 1"] : [] }
      ]);
      setNewField({ label: "", type: "text", required: false });
    }
  };

  const removeFormField = (id) => {
    setFormFields(prev => prev.filter(field => field.id !== id));
  };

  // FAQ handlers
  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFaqs(prev => [...prev, { ...newFaq, id: Date.now() }]);
      setNewFaq({ question: "", answer: "" });
    }
  };

  const updateFaq = (id, updatedFaq) => {
    setFaqs(prev => prev.map(faq => faq.id === id ? { ...faq, ...updatedFaq } : faq));
    setEditingFaq(null);
  };

  const deleteFaq = (id) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  // Customize section handlers
  const handleCustomizeSection = (section) => {
    setCustomizeSection(section);
    setCustomizeFormData({
      title: `${section.name} Form`,
      description: `Customize the ${section.name.toLowerCase()} form for your clients`,
      fields: [],
      settings: {}
    });
  };

  const closeCustomizeModal = () => {
    setCustomizeSection(null);
    setCustomizeFormData({
      title: '',
      description: '',
      fields: [],
      settings: {}
    });
  };

  const saveCustomizeForm = () => {
    // Here you would save the customized form data
    console.log('Saving customized form for:', customizeSection.name, customizeFormData);
    alert(`${customizeSection.name} form customized successfully!`);
    closeCustomizeModal();
  };

  const saveConfiguration = async () => {
    setSaving(true);
    setSaveSuccess(false);
    const config = {
      companyType,
      branding,
      dashboardSections,
      formFields,
      faqs,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage (in a real app, this would be sent to backend)
    localStorage.setItem('clientWorkspaceConfig', JSON.stringify(config));
    
    console.log("Saving configuration:", config);
    setShowPreview(false);
    setIsEditing(true); // Set to editing mode after first save
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const config = {
    companyType,
    branding,
    dashboardSections,
    formFields,
    faqs
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Fixed narrow sidebar */}
      <Sidebar
        toggleSlideMenu={handleHamburgerClick}
        onHamburgerHover={handleHamburgerHover}
        onHamburgerLeave={handleHamburgerLeave}
        isPermanent={isPermanent}
      />

      {/* Separator Line */}
      <div className="fixed top-0 left-16 h-full z-10 border-l-2 border-gray-700 pointer-events-none"></div>

      {/* Slide-out panel */}
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => {
          if (!isPermanent) setMenuOpen(false);
        }}
        onMenuHover={handleMenuHover}
        onMenuLeave={handleMenuLeave}
      />

      {/* Main content */}
      <main
        className={`flex-1 px-6 py-8 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Header with Toggle */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isEditing ? 'Edit' : 'Create'} Client Workspace Configuration
            </h1>
            <p className="text-gray-400">
              {isEditing ? 'Update your existing' : 'Customize your'} client's customer dashboard experience
            </p>
            {isEditing && (
              <p className="text-blue-400 text-sm mt-1">
                Editing existing configuration
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Start Fresh Button for editing mode */}
            {isEditing && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to start fresh? This will clear all current configuration.')) {
                    localStorage.removeItem('clientWorkspaceConfig');
                    window.location.reload(); // Reload to reset all states
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus />
                Start Fresh
              </button>
            )}
            
            {/* Company Type Toggle */}
            <div className="relative">
              <div className="flex items-center bg-gray-700 rounded-full p-1 w-80 h-16">
                <button
                  onClick={toggleCompanyType}
                  className={`flex-1 h-14 rounded-full flex items-center justify-center gap-2 font-semibold text-lg transition-all duration-300 ${
                    companyType === 'service' 
                      ? 'bg-green-500 text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaTools className="text-xl" />
                  Service
                </button>
                <button
                  onClick={toggleCompanyType}
                  className={`flex-1 h-14 rounded-full flex items-center justify-center gap-2 font-semibold text-lg transition-all duration-300 ${
                    companyType === 'product' 
                      ? 'bg-green-500 text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaShoppingCart className="text-xl" />
                  Product
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 max-w-6xl">
          {/* Branding Panel */}
          <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaPalette className="text-blue-400" />
              Branding Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Logo</label>
                <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-600 rounded-lg">
                  {branding.logo ? (
                    <img src={branding.logo} alt="Logo" className="w-16 h-16 object-contain mb-2" />
                  ) : (
                    <FaUpload className="text-gray-500 text-2xl mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Upload Logo
                  </label>
                </div>
              </div>

              {/* Primary Color */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Primary Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBranding(prev => ({ ...prev, primaryColor: color.value }))}
                      className={`w-12 h-12 rounded-lg ${color.class} ${
                        branding.primaryColor === color.value 
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e293b]' 
                          : 'hover:scale-105'
                      } transition-all`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Welcome Message</label>
                <textarea
                  value={branding.welcomeMessage}
                  onChange={(e) => setBranding(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter welcome message..."
                />
              </div>
            </div>
          </div>

          {/* Dashboard Layout Control */}
          <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaCog className="text-green-400" />
              Dashboard Layout Control - {companyType === 'service' ? 'Service' : 'Product'} Based
            </h2>
            <div className="space-y-3">
              {dashboardSections.map((section, index) => {
                const IconComponent = ICONS[section.icon];
                const color = COLOR_CLASSES[branding.primaryColor] || COLOR_CLASSES.blue;
                return (
                  <div key={section.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-gray-600">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={() => toggleSection(section.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className={`text-lg ${color.text}`}>{IconComponent && <IconComponent />}</span>
                      <span className="text-white font-medium">{section.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCustomizeSection(section)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                      >
                        <FaCog />
                        Customize
                      </button>
                      <button
                        onClick={() => moveSectionUp(section.id)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        onClick={() => moveSectionDown(section.id)}
                        disabled={index === dashboardSections.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowDown />
                      </button>
                      <FaGripVertical className="text-gray-500 cursor-move" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Builder */}
          <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaEdit className="text-purple-400" />
              Input Form Builder
            </h2>
            
            {/* Existing Fields */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-300">Existing Fields</h3>
              {formFields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <span className="text-white font-medium">{field.label}</span>
                    <span className="text-gray-400 ml-2">({field.type})</span>
                    {field.required && <span className="text-red-400 ml-2">*</span>}
                  </div>
                  <button
                    onClick={() => removeFormField(field.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Field */}
            <div className="border-t border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Add New Field</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full p-2 bg-[#0f172a] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Field label..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 bg-[#0f172a] border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300 text-sm">Required</span>
                  </label>
                </div>
                <button
                  onClick={addFormField}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaPlus />
                  Add Field
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Content Editor */}
          <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaQuestion className="text-yellow-400" />
              FAQ Content Editor
            </h2>
            
            {/* Existing FAQs */}
            <div className="space-y-4 mb-6">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-[#0f172a] rounded-lg border border-gray-600">
                  {editingFaq === faq.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f))}
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, answer: e.target.value } : f))}
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateFaq(faq.id, faq)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <FaCheck /> Save
                        </button>
                        <button
                          onClick={() => setEditingFaq(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{faq.question}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingFaq(faq.id)}
                            className="text-blue-400 hover:text-blue-300 p-1"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteFaq(faq.id)}                         
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New FAQ */}
            <div className="border-t border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Add New FAQ</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter question..."
                />
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter answer..."
                />
                <button
                  onClick={addFaq}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaPlus />
                  Add FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-lg"
            >
              <FaEye />
              Preview
            </button>
            
            <button
              onClick={saveConfiguration}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-lg"
              disabled={saving}
            >
              {saving ? (<><FaSave className="animate-spin" /> Saving...</>) : saveSuccess ? (<><FaCheck /> Saved!</>) : (<><FaSave /> {isEditing ? 'Update Configuration' : 'Save Configuration'}</>)}
            </button>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        config={config}
        companyType={companyType}
      />

      {/* Customize Modal */}
      <CustomizeModal
        isOpen={!!customizeSection}
        onClose={closeCustomizeModal}
        onSave={saveCustomizeForm}
        section={customizeSection}
        formData={customizeFormData}
        setFormData={setCustomizeFormData}
      />
    </div>
  );
}