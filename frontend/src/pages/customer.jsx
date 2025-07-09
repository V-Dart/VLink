import React, { useState } from "react";
import {
  FaChevronDown, FaChevronUp, FaTicketAlt, FaCheckCircle, FaExclamationCircle, FaQuestionCircle, FaEnvelope, FaPhoneAlt, FaRegCommentDots, FaClipboardList, FaInbox, FaCommentDots, FaUserCircle, FaBars, FaTimes, FaHome, FaComments, FaInfoCircle, FaClock, FaArrowRight, FaHeadset, FaStar, FaLightbulb, FaShoppingBag, FaBox, FaFilter, FaEye, FaUndo, FaMoneyBillWave, FaShippingFast, FaTruck, FaMapMarkerAlt
} from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import signupImage from "../assets/Signup.png";

const issueTypes = [
  "Product Defect",
  "Late Delivery",
  "Payment Issue",
  "Other",
];

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "You can track your order status in your account dashboard under 'Orders'.",
  },
  {
    question: "What should I do if I receive a defective product?",
    answer:
      "Please raise an issue using the form below and our support team will assist you promptly.",
  },
  {
    question: "How do I request a refund?",
    answer:
      "Contact our support team via email or phone with your order details to initiate a refund.",
  },
  {
    question: "Can I change my delivery address after placing an order?",
    answer:
      "If your order hasn't shipped yet, contact us as soon as possible to update your address.",
  },
];

const initialTickets = [
  {
    id: "TCK-1001",
    type: "Feedback",
    subject: "Great product, but could use more integrations",
    status: "Resolved",
    date: "2024-05-01",
  },
  {
    id: "TCK-1002",
    type: "Issue",
    subject: "Received a defective item",
    status: "Open",
    date: "2024-05-10",
  },
  {
    id: "TCK-1003",
    type: "Issue",
    subject: "Payment not reflecting",
    status: "In Progress",
    date: "2024-05-15",
  },
];

const initialOrders = [
  {
    id: "ORD-2024-001",
    productName: "MacBook Pro 16-inch",
    category: "Electronics",
    componentType: "Laptop",
    orderDate: "2024-06-15",
    status: "Delivered",
    trackingStatus: "Delivered",
    price: "$2,499.00",
    image: "https://via.placeholder.com/300x200?text=MacBook+Pro",
    specifications: {
      RAM: "32GB",
      Storage: "1TB SSD",
      Color: "Space Gray",
      Processor: "M3 Max"
    },
    tracking: [
      { status: "Ordered", date: "2024-06-15", completed: true },
      { status: "Processing", date: "2024-06-16", completed: true },
      { status: "Shipped", date: "2024-06-18", completed: true },
      { status: "Out for Delivery", date: "2024-06-20", completed: true },
      { status: "Delivered", date: "2024-06-21", completed: true }
    ]
  },
  {
    id: "ORD-2024-002",
    productName: "iPhone 15 Pro",
    category: "Electronics",
    componentType: "Phone",
    orderDate: "2024-07-02",
    status: "Shipped",
    trackingStatus: "Out for Delivery",
    price: "$999.00",
    image: "https://via.placeholder.com/300x200?text=iPhone+15+Pro",
    specifications: {
      Storage: "256GB",
      Color: "Natural Titanium",
      Model: "Pro"
    },
    tracking: [
      { status: "Ordered", date: "2024-07-02", completed: true },
      { status: "Processing", date: "2024-07-03", completed: true },
      { status: "Shipped", date: "2024-07-05", completed: true },
      { status: "Out for Delivery", date: "2024-07-08", completed: true },
      { status: "Delivered", date: "", completed: false }
    ]
  },
  {
    id: "ORD-2024-003",
    productName: "AirPods Pro",
    category: "Electronics",
    componentType: "Audio",
    orderDate: "2024-07-10",
    status: "Processing",
    trackingStatus: "Processing",
    price: "$249.00",
    image: "https://via.placeholder.com/300x200?text=AirPods+Pro",
    specifications: {
      Color: "White",
      NoiseCancel: "Active",
      Case: "MagSafe"
    },
    tracking: [
      { status: "Ordered", date: "2024-07-10", completed: true },
      { status: "Processing", date: "2024-07-11", completed: true },
      { status: "Shipped", date: "", completed: false },
      { status: "Out for Delivery", date: "", completed: false },
      { status: "Delivered", date: "", completed: false }
    ]
  }
];

export default function CustomerPortal() {
  // Feedback form state
  const [feedback, setFeedback] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  // Issue form state
  const [issue, setIssue] = useState({
    name: "",
    email: "",
    type: issueTypes[0],
    description: "",
  });
  const [issueErrors, setIssueErrors] = useState({});
  const [issueMsg, setIssueMsg] = useState("");
  // Collapsible state
  const [openSection, setOpenSection] = useState(null); // 'feedback', 'issue', 'faq'
  const [openFaq, setOpenFaq] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);
  
  // Navigation state
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Orders state
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilters, setOrderFilters] = useState({
    dateRange: 'all',
    category: 'all',
    componentType: 'all',
    status: 'all'
  });
  
  // Ticket modal state
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketOrder, setTicketOrder] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    type: 'Refund',
    description: ''
  });

  // Get user name from localStorage
  let userName = "Customer";
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) userName = user.username;
  } catch {}

  // Get recent tickets (last 3)
  const recentTickets = tickets.slice(-3);
  const openTicketsCount = tickets.filter(t => t.status === 'Open').length;
  const resolvedTicketsCount = tickets.filter(t => t.status === 'Resolved').length;

  // Stat widgets (enhanced design)
  const statWidgets = [
    {
      icon: <FaClipboardList className="text-blue-400 text-3xl" />,
      label: "Total Tickets",
      value: tickets.length,
      change: "+2 this month",
      bg: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
      border: "border-blue-400/30",
    },
    {
      icon: <FaCheckCircle className="text-green-400 text-3xl" />,
      label: "Resolved",
      value: resolvedTicketsCount,
      change: `${Math.round((resolvedTicketsCount / tickets.length) * 100) || 0}% success rate`,
      bg: "bg-gradient-to-br from-green-500/20 to-green-600/10",
      border: "border-green-400/30",
    },
    {
      icon: <FaClock className="text-yellow-400 text-3xl" />,
      label: "Pending",
      value: openTicketsCount,
      change: "Avg. 2 days response",
      bg: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10",
      border: "border-yellow-400/30",
    },
  ];

  // Quick action cards
  const quickActions = [
    {
      icon: <FaRegCommentDots className="text-blue-400 text-2xl" />,
      title: "Submit Feedback",
      description: "Share your thoughts and help us improve",
      action: () => toggleSection('feedback'),
      bg: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
      border: "border-blue-400/20",
    },
    {
      icon: <FaExclamationCircle className="text-red-400 text-2xl" />,
      title: "Report Issue",
      description: "Get quick help with any problems",
      action: () => toggleSection('issue'),
      bg: "bg-gradient-to-br from-red-500/10 to-red-600/5",
      border: "border-red-400/20",
    },
    {
      icon: <FaQuestionCircle className="text-purple-400 text-2xl" />,
      title: "Browse FAQ",
      description: "Find answers to common questions",
      action: () => toggleSection('faq'),
      bg: "bg-gradient-to-br from-purple-500/10 to-purple-600/5",
      border: "border-purple-400/20",
    },
  ];

  // Feedback submit handler
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setFeedbackMsg("Please enter your feedback.");
      return;
    }
    setTickets([
      ...tickets,
      {
        id: `TCK-${1000 + tickets.length + 1}`,
        type: "Feedback",
        subject: feedback,
        status: "Open",
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setFeedbackMsg("Thank you for your feedback!");
    setFeedback("");
  };

  // Issue form validation
  const validateIssue = () => {
    const errors = {};
    if (!issue.name.trim()) errors.name = "Name is required.";
    if (!issue.email.trim()) errors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(issue.email))
      errors.email = "Invalid email address.";
    if (!issue.description.trim()) errors.description = "Description is required.";
    return errors;
  };

  // Issue submit handler
  const handleIssueSubmit = (e) => {
    e.preventDefault();
    const errors = validateIssue();
    setIssueErrors(errors);
    if (Object.keys(errors).length === 0) {
      setTickets([
        ...tickets,
        {
          id: `TCK-${1000 + tickets.length + 1}`,
          type: "Issue",
          subject: issue.description,
          status: "Open",
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
      setIssueMsg("Your issue has been submitted. Our team will contact you soon.");
      setIssue({ name: "", email: "", type: issueTypes[0], description: "" });
    } else {
      setIssueMsg("");
    }
  };

  // Collapsible toggle
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Orders functionality
  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (orderFilters.category !== 'all' && order.category !== orderFilters.category) return false;
      if (orderFilters.componentType !== 'all' && order.componentType !== orderFilters.componentType) return false;
      if (orderFilters.status !== 'all' && order.status !== orderFilters.status) return false;
      return true;
    });
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleRaiseTicket = (order) => {
    setTicketOrder(order);
    setShowTicketModal(true);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    
    // Create new ticket
    const newTicket = {
      id: `TCK-${1000 + tickets.length + 1}`,
      type: "Issue",
      subject: `${ticketForm.type} request for order ${ticketOrder.id}`,
      status: "Open",
      date: new Date().toISOString().slice(0, 10),
      orderRef: ticketOrder.id
    };

    setTickets([...tickets, newTicket]);
    
    // Log for debugging
    console.log('Ticket submitted:', {
      order: ticketOrder,
      ticketType: ticketForm.type,
      description: ticketForm.description,
      ticket: newTicket
    });

    // Reset form and close modal
    setShowTicketModal(false);
    setTicketOrder(null);
    setTicketForm({ type: 'Refund', description: '' });
    
    alert(`Ticket ${newTicket.id} has been created successfully!`);
  };

  // Side panel links
  const navLinks = [
    { label: "Dashboard", icon: <FaHome />, section: "dashboard" },
    { label: "Orders", icon: <FaShoppingBag />, section: "orders" },
    { label: "Feedback", icon: <FaRegCommentDots />, section: "feedback" },
    { label: "Support", icon: <FaHeadset />, section: "support" },
    { label: "FAQ", icon: <FaQuestionCircle />, section: "faq" },
    { label: "Contact", icon: <FaEnvelope />, section: "contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Side Panel */}
      <aside className="fixed left-0 top-0 bottom-0 h-screen w-64 bg-slate-800/95 backdrop-blur-sm shadow-2xl border-r border-slate-700/50 z-30"> 
        <div className="flex flex-col items-center py-8 px-4">
          <div className="relative">
            <FaUserCircle className="text-6xl text-blue-400 mb-3 drop-shadow-lg" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-800"></div>
          </div>
          <div className="text-xl font-bold text-white mb-1">{userName}</div>
          <div className="text-sm text-slate-400 mb-4 font-medium">Customer Portal</div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4"></div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-4">
          {navLinks.map((link, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                setActiveSection(link.section);
                setSelectedOrder(null);
                setOpenSection(null);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group text-left w-full ${
                activeSection === link.section 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto flex justify-center pb-6 md:hidden">
          <button onClick={() => setSideOpen(false)} className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors"><FaTimes /></button>
        </div>
      </aside>
      {/* Hamburger for mobile */}
      <button className="fixed top-4 left-4 z-40 md:hidden p-3 rounded-xl bg-slate-800/90 backdrop-blur-sm shadow-lg hover:bg-slate-700 text-white transition-all" onClick={() => setSideOpen(true)}><FaBars /></button>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 transition-all duration-300 w-full ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <>
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Welcome back, {userName}!
                    </h1>
                    <p className="text-slate-400 text-lg">Here's your support dashboard overview</p>
                  </div>
                  <div className="hidden lg:flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-medium">Support Online</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {statWidgets.map((stat, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 ${stat.bg} ${stat.border}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-white/5">{stat.icon}</div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">{stat.value}</div>
                          <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <IoMdTrendingUp className="text-green-400" />
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <FaLightbulb className="text-yellow-400 text-xl" />
                  <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.action}
                      className={`p-6 rounded-2xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 text-left group ${action.bg} ${action.border}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">{action.icon}</div>
                        <FaArrowRight className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                      <p className="text-slate-400 text-sm">{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expandable Sections */}
              {openSection && (
                <div className="mb-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    {openSection === 'feedback' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FaRegCommentDots className="text-blue-400 text-xl" />
                          <h3 className="text-xl font-bold text-white">Submit Feedback</h3>
                        </div>
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                          <textarea
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 min-h-[120px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                            placeholder="Share your thoughts, suggestions, or experiences with us..."
                            value={feedback}
                            onChange={(e) => {
                              setFeedback(e.target.value);
                              setFeedbackMsg("");
                            }}
                          />
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setOpenSection(null)}
                              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                            >
                              Submit Feedback
                            </button>
                          </div>
                          {feedbackMsg && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                              {feedbackMsg}
                            </div>
                          )}
                        </form>
                      </div>
                    )}

                    {openSection === 'issue' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FaExclamationCircle className="text-red-400 text-xl" />
                          <h3 className="text-xl font-bold text-white">Report an Issue</h3>
                        </div>
                        <form onSubmit={handleIssueSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">Name</label>
                              <input
                                type="text"
                                className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 focus:ring-2 transition-all ${issueErrors.name ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                                value={issue.name}
                                onChange={(e) => setIssue({ ...issue, name: e.target.value })}
                              />
                              {issueErrors.name && <span className="text-xs text-red-400 mt-1 block">{issueErrors.name}</span>}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">Email</label>
                              <input
                                type="email"
                                className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 focus:ring-2 transition-all ${issueErrors.email ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                                value={issue.email}
                                onChange={(e) => setIssue({ ...issue, email: e.target.value })}
                              />
                              {issueErrors.email && <span className="text-xs text-red-400 mt-1 block">{issueErrors.email}</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Issue Type</label>
                            <select
                              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                              value={issue.type}
                              onChange={(e) => setIssue({ ...issue, type: e.target.value })}
                            >
                              {issueTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">Description</label>
                            <textarea
                              className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 min-h-[100px] focus:ring-2 transition-all resize-none ${issueErrors.description ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                              value={issue.description}
                              onChange={(e) => setIssue({ ...issue, description: e.target.value })}
                              placeholder="Please describe your issue in detail..."
                            />
                            {issueErrors.description && <span className="text-xs text-red-400 mt-1 block">{issueErrors.description}</span>}
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setOpenSection(null)}
                              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
                            >
                              Submit Issue
                            </button>
                          </div>
                          {issueMsg && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                              {issueMsg}
                            </div>
                          )}
                        </form>
                      </div>
                    )}

                    {openSection === 'faq' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FaQuestionCircle className="text-purple-400 text-xl" />
                          <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
                        </div>
                        <div className="space-y-3">
                          {faqs.map((faq, idx) => (
                            <div key={idx} className="border border-slate-700/50 rounded-xl overflow-hidden">
                              <button
                                className="w-full text-left px-4 py-4 hover:bg-slate-700/30 transition-colors flex justify-between items-center"
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                              >
                                <span className="font-medium text-white">{faq.question}</span>
                                <span className="text-purple-400">{openFaq === idx ? <FaChevronUp /> : <FaChevronDown />}</span>
                              </button>
                              {openFaq === idx && (
                                <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50">
                                  <div className="pt-3">{faq.answer}</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Activity & Support */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Summary */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <FaClock className="text-blue-400 text-xl" />
                        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                      </div>
                      {tickets.length > 3 && (
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                          View All <FaArrowRight className="text-xs" />
                        </button>
                      )}
                    </div>
                    
                    {recentTickets.length === 0 ? (
                      <div className="text-center py-8">
                        <FaClipboardList className="text-slate-600 text-4xl mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No recent activity</p>
                        <p className="text-slate-500 text-sm">Your tickets and feedback will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentTickets.reverse().map((ticket) => (
                          <div key={ticket.id} className="flex items-center gap-4 p-4 bg-slate-900/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                            <div className={`p-2 rounded-lg ${ticket.type === 'Issue' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {ticket.type === 'Issue' ? <FaExclamationCircle /> : <FaRegCommentDots />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{ticket.subject}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-400">{ticket.id}</span>
                                <span className="text-xs text-slate-500">•</span>
                                <span className="text-xs text-slate-400">{ticket.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {ticket.status === 'Resolved' && <span className="flex items-center gap-1 text-green-400 text-sm"><FaCheckCircle className="text-xs" /> Resolved</span>}
                              {ticket.status === 'Open' && <span className="flex items-center gap-1 text-red-400 text-sm"><FaExclamationCircle className="text-xs" /> Open</span>}
                              {ticket.status === 'In Progress' && <span className="flex items-center gap-1 text-yellow-400 text-sm"><FaClock className="text-xs" /> In Progress</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Support Contact */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <FaHeadset className="text-green-400 text-xl" />
                      <h3 className="text-xl font-bold text-white">Need Help?</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-3 mb-2">
                          <FaEnvelope className="text-blue-400" />
                          <span className="text-white font-medium">Email Support</span>
                        </div>
                        <p className="text-slate-400 text-sm">support@company.com</p>
                      </div>
                      <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-3 mb-2">
                          <FaPhoneAlt className="text-green-400" />
                          <span className="text-white font-medium">Phone Support</span>
                        </div>
                        <p className="text-slate-400 text-sm">+1 (800) 123-4567</p>
                      </div>
                      <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-3 mb-2">
                          <FaClock className="text-yellow-400" />
                          <span className="text-white font-medium">Support Hours</span>
                        </div>
                        <p className="text-slate-400 text-sm">Mon–Fri, 9am–6pm EST</p>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <FaStar className="text-yellow-400" />
                        <span>4.9/5 satisfaction rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div>
              {!selectedOrder ? (
                <>
                  {/* Orders Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        My Orders
                      </h1>
                      <p className="text-slate-400 text-lg">Track and manage your orders</p>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <FaFilter className="text-blue-400" />
                      <h3 className="text-lg font-bold text-white">Filter Orders</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <select
                        className="bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        value={orderFilters.category}
                        onChange={(e) => setOrderFilters({...orderFilters, category: e.target.value})}
                      >
                        <option value="all">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                      </select>
                      <select
                        className="bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        value={orderFilters.componentType}
                        onChange={(e) => setOrderFilters({...orderFilters, componentType: e.target.value})}
                      >
                        <option value="all">All Types</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Phone">Phone</option>
                        <option value="Audio">Audio</option>
                      </select>
                      <select
                        className="bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        value={orderFilters.status}
                        onChange={(e) => setOrderFilters({...orderFilters, status: e.target.value})}
                      >
                        <option value="all">All Status</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <button
                        onClick={() => setOrderFilters({dateRange: 'all', category: 'all', componentType: 'all', status: 'all'})}
                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  {/* Orders Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {getFilteredOrders().map((order) => (
                      <div
                        key={order.id}
                        onClick={() => handleOrderClick(order)}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:scale-105"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={order.image}
                            alt={order.productName}
                            className="w-20 h-20 rounded-xl object-cover border border-slate-600"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">{order.productName}</h3>
                            <p className="text-slate-400 text-sm mb-2">{order.id}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">{order.orderDate}</span>
                          <span className="text-white font-bold">{order.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Order Detail View */
                <div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
                  >
                    <FaArrowRight className="rotate-180" />
                    Back to Orders
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Product Info */}
                    <div className="lg:col-span-2">
                      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <img
                            src={selectedOrder.image}
                            alt={selectedOrder.productName}
                            className="w-full md:w-64 h-48 md:h-64 rounded-xl object-cover border border-slate-600"
                          />
                          <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-4">{selectedOrder.productName}</h1>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400">Order ID:</span>
                                <span className="text-white font-mono">{selectedOrder.id}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400">Order Date:</span>
                                <span className="text-white">{selectedOrder.orderDate}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  selectedOrder.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                  selectedOrder.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {selectedOrder.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400">Price:</span>
                                <span className="text-white font-bold text-xl">{selectedOrder.price}</span>
                              </div>
                            </div>

                            {/* Specifications */}
                            <div className="mt-6">
                              <h3 className="text-lg font-bold text-white mb-3">Specifications</h3>
                              <div className="grid grid-cols-2 gap-3">
                                {Object.entries(selectedOrder.specifications).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-slate-400">{key}:</span>
                                    <span className="text-white">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tracking */}
                      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                          <FaTruck className="text-blue-400" />
                          Order Tracking
                        </h3>
                        <div className="space-y-4">
                          {selectedOrder.tracking.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.completed ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'
                              }`}>
                                {step.completed ? <FaCheckCircle className="text-sm" /> : <FaClock className="text-sm" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className={`font-medium ${step.completed ? 'text-white' : 'text-slate-400'}`}>
                                    {step.status}
                                  </span>
                                  <span className="text-slate-400 text-sm">{step.date}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Need Help?</h3>
                        <div className="space-y-4">
                          <button
                            onClick={() => handleRaiseTicket(selectedOrder)}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                          >
                            <FaExclamationCircle />
                            Raise a Ticket
                          </button>
                          <div className="grid grid-cols-1 gap-2">
                            <button className="flex items-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors text-sm">
                              <FaUndo />
                              Request Return
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors text-sm">
                              <FaMoneyBillWave />
                              Request Refund
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other Sections */}
          {activeSection === 'feedback' && (
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">Feedback</h1>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaRegCommentDots className="text-blue-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">Submit Feedback</h3>
                </div>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <textarea
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 min-h-[120px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                    placeholder="Share your thoughts, suggestions, or experiences with us..."
                    value={feedback}
                    onChange={(e) => {
                      setFeedback(e.target.value);
                      setFeedbackMsg("");
                    }}
                  />
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                    >
                      Submit Feedback
                    </button>
                  </div>
                  {feedbackMsg && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                      {feedbackMsg}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {activeSection === 'support' && (
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">Support</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-blue-400" />
                      <span className="text-white">support@company.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhoneAlt className="text-green-400" />
                      <span className="text-white">+1 (800) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaClock className="text-yellow-400" />
                      <span className="text-white">Mon–Fri, 9am–6pm EST</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleSection('issue')}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                    >
                      <FaExclamationCircle />
                      Report an Issue
                    </button>
                    <button
                      onClick={() => setActiveSection('faq')}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                    >
                      <FaQuestionCircle />
                      Browse FAQ
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Issue Form */}
              {openSection === 'issue' && (
                <div className="mt-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <FaExclamationCircle className="text-red-400 text-xl" />
                      <h3 className="text-xl font-bold text-white">Report an Issue</h3>
                    </div>
                    <form onSubmit={handleIssueSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Name</label>
                          <input
                            type="text"
                            className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 focus:ring-2 transition-all ${issueErrors.name ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                            value={issue.name}
                            onChange={(e) => setIssue({ ...issue, name: e.target.value })}
                          />
                          {issueErrors.name && <span className="text-xs text-red-400 mt-1 block">{issueErrors.name}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Email</label>
                          <input
                            type="email"
                            className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 focus:ring-2 transition-all ${issueErrors.email ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                            value={issue.email}
                            onChange={(e) => setIssue({ ...issue, email: e.target.value })}
                          />
                          {issueErrors.email && <span className="text-xs text-red-400 mt-1 block">{issueErrors.email}</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Issue Type</label>
                        <select
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                          value={issue.type}
                          onChange={(e) => setIssue({ ...issue, type: e.target.value })}
                        >
                          {issueTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Description</label>
                        <textarea
                          className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 min-h-[100px] focus:ring-2 transition-all resize-none ${issueErrors.description ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                          value={issue.description}
                          onChange={(e) => setIssue({ ...issue, description: e.target.value })}
                          placeholder="Please describe your issue in detail..."
                        />
                        {issueErrors.description && <span className="text-xs text-red-400 mt-1 block">{issueErrors.description}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setOpenSection(null)}
                          className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
                        >
                          Submit Issue
                        </button>
                      </div>
                      {issueMsg && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                          {issueMsg}
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'faq' && (
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h1>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-slate-700/50 rounded-xl overflow-hidden">
                      <button
                        className="w-full text-left px-4 py-4 hover:bg-slate-700/30 transition-colors flex justify-between items-center"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      >
                        <span className="font-medium text-white">{faq.question}</span>
                        <span className="text-purple-400">{openFaq === idx ? <FaChevronUp /> : <FaChevronDown />}</span>
                      </button>
                      {openFaq === idx && (
                        <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50">
                          <div className="pt-3">{faq.answer}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaEnvelope className="text-blue-400 text-xl" />
                    <h3 className="text-lg font-bold text-white">Email Support</h3>
                  </div>
                  <p className="text-slate-400 mb-2">support@company.com</p>
                  <p className="text-slate-500 text-sm">We respond within 24 hours</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaPhoneAlt className="text-green-400 text-xl" />
                    <h3 className="text-lg font-bold text-white">Phone Support</h3>
                  </div>
                  <p className="text-slate-400 mb-2">+1 (800) 123-4567</p>
                  <p className="text-slate-500 text-sm">Mon–Fri, 9am–6pm EST</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaStar className="text-yellow-400 text-xl" />
                    <h3 className="text-lg font-bold text-white">Satisfaction</h3>
                  </div>
                  <p className="text-slate-400 mb-2">4.9/5 rating</p>
                  <p className="text-slate-500 text-sm">Based on 10,000+ reviews</p>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Modal */}
          {showTicketModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Raise a Ticket</h3>
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Order</label>
                    <input
                      type="text"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-slate-400 px-4 py-3"
                      value={`${ticketOrder?.productName} (${ticketOrder?.id})`}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Issue Type</label>
                    <select
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      value={ticketForm.type}
                      onChange={(e) => setTicketForm({...ticketForm, type: e.target.value})}
                    >
                      <option value="Refund">Refund Request</option>
                      <option value="Return">Return Request</option>
                      <option value="Damaged">Damaged Product</option>
                      <option value="Other">Other Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <textarea
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 min-h-[100px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                      placeholder="Please describe your issue in detail..."
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setShowTicketModal(false)}
                      className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 