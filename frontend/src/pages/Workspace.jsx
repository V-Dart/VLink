import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import {
  FaEdit,
  FaCog,
  FaPlus,
  FaTools,
  FaShoppingCart,
  FaCalendarAlt,
  FaCreditCard,
  FaWarehouse,
  FaTruck,
  FaHeadset,
  FaListUl,
  FaComments,
  FaQuestion,
  FaTicketAlt,
  FaArrowDown,
  FaEye,
  FaBuilding
} from "react-icons/fa";

export default function Workspace() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [savedConfig, setSavedConfig] = useState(null);
  const navigate = useNavigate();

  // Load saved configuration on component mount
  useEffect(() => {
    const config = localStorage.getItem('clientWorkspaceConfig');
    if (config) {
      try {
        setSavedConfig(JSON.parse(config));
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }
  }, []);

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

  const handleEditConfiguration = () => {
    navigate('/client-config');
  };

  const handleCreateConfiguration = () => {
    navigate('/client-config');
  };

  const getEnabledSections = () => {
    if (!savedConfig) return [];
    return savedConfig.dashboardSections.filter(section => section.enabled);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar
        toggleSlideMenu={handleHamburgerClick}
        onHamburgerHover={handleHamburgerHover}
        onHamburgerLeave={handleHamburgerLeave}
        isPermanent={isPermanent}
      />
      {isMenuOpen && <div className="fixed top-0 left-16 h-full z-10"></div>}
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => {
          if (!isPermanent) setMenuOpen(false);
        }}
        onMenuHover={handleMenuHover}
        onMenuLeave={handleMenuLeave}
      />
      <main
        className={`flex-1 px-6 py-8 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {savedConfig ? (
          // Display configured workspace
          <div className="space-y-6">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Client Workspace
                </h1>
                <p className="text-gray-400">
                  {savedConfig.companyType === 'service' ? 'Service-based' : 'Product-based'} company configuration
                </p>
                <p className="text-gray-500 text-sm">
                  Last updated: {formatDate(savedConfig.timestamp)}
                </p>
              </div>
              <button
                onClick={handleEditConfiguration}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaEdit />
                Edit Configuration
              </button>
            </div>

            {/* Company Type Badge */}
            <div className="flex items-center gap-2 w-fit bg-[#1e293b] rounded-lg p-3 border border-gray-700">
              {savedConfig.companyType === 'service' ? (
                <>
                  <FaTools className="text-blue-400" />
                  <span className="text-white font-medium">Service Company</span>
                </>
              ) : (
                <>
                  <FaShoppingCart className="text-green-400" />
                  <span className="text-white font-medium">Product Company</span>
                </>
              )}
            </div>

            {/* Branding Preview */}
            <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Branding Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Logo</h3>
                  <div className="bg-[#0f172a] rounded-lg p-4 border border-gray-600 flex items-center justify-center h-20">
                    {savedConfig.branding.logo ? (
                      <img src={savedConfig.branding.logo} alt="Logo" className="max-h-16 max-w-full object-contain" />
                    ) : (
                      <span className="text-gray-500">No logo uploaded</span>
                    )}
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Primary Color</h3>
                  <div className="bg-[#0f172a] rounded-lg p-4 border border-gray-600 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-${savedConfig.branding.primaryColor}-500`}></div>
                    <span className="text-white capitalize">{savedConfig.branding.primaryColor}</span>
                  </div>
                </div>

                {/* Welcome Message */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Welcome Message</h3>
                  <div className="bg-[#0f172a] rounded-lg p-4 border border-gray-600">
                    <p className="text-white text-sm">{savedConfig.branding.welcomeMessage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Sections */}
            <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Dashboard Sections ({getEnabledSections().length} enabled)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getEnabledSections().map((section, index) => (
                  <div key={section.id} className="bg-[#0f172a] p-4 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-lg text-${savedConfig.branding.primaryColor}-400`}>{section.icon}</span>
                      <h3 className="text-white font-medium">{section.name}</h3>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">#{index + 1}</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {section.name === 'Orders' && 'Customer order management'}
                      {section.name === 'Feedback' && 'Customer feedback collection'}
                      {section.name === 'Help' && 'Help and support center'}
                      {section.name === 'Chat' && 'Live chat support'}
                      {section.name === 'Tickets' && 'Support ticket system'}
                      {section.name === 'FAQs' && 'Frequently asked questions'}
                      {section.name === 'Service Requests' && 'Service request management'}
                      {section.name === 'Appointments' && 'Appointment scheduling'}
                      {section.name === 'Billing' && 'Billing and payments'}
                      {section.name === 'Inventory' && 'Product inventory'}
                      {section.name === 'Shipping' && 'Shipping and tracking'}
                      {section.name === 'Returns' && 'Returns and refunds'}
                      {section.name === 'Support' && 'Customer support'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            {savedConfig.formFields.length > 0 && (
              <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Form Fields ({savedConfig.formFields.length} configured)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedConfig.formFields.map((field) => (
                    <div key={field.id} className="bg-[#0f172a] p-4 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{field.label}</h3>
                        {field.required && <span className="text-red-400 text-sm">Required</span>}
                      </div>
                      <p className="text-gray-400 text-sm capitalize">{field.type} field</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {savedConfig.faqs.length > 0 && (
              <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">FAQs ({savedConfig.faqs.length} configured)</h2>
                <div className="space-y-4">
                  {savedConfig.faqs.slice(0, 3).map((faq) => (
                    <div key={faq.id} className="bg-[#0f172a] p-4 rounded-lg border border-gray-600">
                      <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                      <p className="text-gray-400 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                  {savedConfig.faqs.length > 3 && (
                    <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-600 text-center">
                      <p className="text-gray-400">... and {savedConfig.faqs.length - 3} more FAQs</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Created Designs Gallery */}
            <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Created Designs</h2>
                <button 
                  onClick={handleEditConfiguration}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaEdit />
                  Create New Design
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Main Configuration Design Card */}
                <div className="bg-[#0f172a] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    {savedConfig.branding.logo ? (
                      <img src={savedConfig.branding.logo} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                        <FaBuilding className="text-gray-400 text-sm" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-medium">Main Portal</h3>
                      <p className="text-gray-400 text-xs">{savedConfig.companyType} based</p>
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {savedConfig.branding.welcomeMessage}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs bg-${savedConfig.branding.primaryColor}-500 bg-opacity-20 text-${savedConfig.branding.primaryColor}-400`}>
                      {getEnabledSections().length} sections
                    </span>
                    <button 
                      onClick={handleEditConfiguration}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Individual Section Design Cards */}
                {getEnabledSections().slice(0, 6).map((section) => (
                  <div key={section.id} className="bg-[#0f172a] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-lg text-${savedConfig.branding.primaryColor}-400`}>{section.icon}</span>
                      <div>
                        <h3 className="text-white font-medium">{section.name}</h3>
                        <p className="text-gray-400 text-xs">Form Design</p>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm mb-3">
                      Custom {section.name.toLowerCase()} form with dynamic fields and validation
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {section.name === 'Orders' && '6 fields'}
                        {section.name === 'Feedback' && '4 fields'}
                        {section.name === 'Help' && '5 fields'}
                        {section.name === 'Chat' && '3 fields'}
                        {section.name === 'Tickets' && '7 fields'}
                        {section.name === 'FAQs' && '2 fields'}
                        {section.name === 'Service Requests' && '8 fields'}
                        {section.name === 'Appointments' && '6 fields'}
                        {section.name === 'Billing' && '5 fields'}
                        {section.name === 'Inventory' && '4 fields'}
                        {section.name === 'Shipping' && '7 fields'}
                        {section.name === 'Returns' && '6 fields'}
                        {section.name === 'Support' && '5 fields'}
                      </span>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Customize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Portal Preview */}
            <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Live Portal Preview</h2>
                <div className="flex gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <FaEye />
                    Preview
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <FaEye />
                    Go Live
                  </button>
                </div>
              </div>
              <div className="bg-[#0f172a] rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-4 mb-6">
                  {savedConfig.branding.logo && (
                    <img src={savedConfig.branding.logo} alt="Logo" className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <h3 className={`text-xl font-bold text-${savedConfig.branding.primaryColor}-400`}>
                      {savedConfig.companyType === 'service' ? 'Service Portal' : 'Product Portal'}
                    </h3>
                    <p className="text-gray-300">{savedConfig.branding.welcomeMessage}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {getEnabledSections().slice(0, 8).map((section) => (
                    <div key={section.id} className="bg-[#1e293b] p-3 rounded border border-gray-600 text-center hover:border-gray-500 transition-colors cursor-pointer">
                      <span className={`text-2xl text-${savedConfig.branding.primaryColor}-400 block mb-1`}>{section.icon}</span>
                      <span className="text-white text-xs">{section.name}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Interactive portal with {getEnabledSections().length} enabled sections
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // No configuration found
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <FaBuilding className="text-6xl text-gray-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">
                No Workspace Configuration
              </h1>
              <p className="text-gray-400 mb-8">
                Create your first client workspace configuration to customize the customer dashboard experience.
              </p>
              <button
                onClick={handleCreateConfiguration}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors mx-auto text-lg"
              >
                <FaPlus />
                Create Configuration
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}