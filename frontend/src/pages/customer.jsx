import React, { useState } from "react";
import {
  FaChevronDown, FaChevronUp, FaTicketAlt, FaCheckCircle, FaExclamationCircle, FaQuestionCircle, FaEnvelope, FaPhoneAlt, FaRegCommentDots, FaClipboardList, FaInbox, FaCommentDots, FaUserCircle, FaBars, FaTimes, FaHome, FaComments, FaInfoCircle
} from "react-icons/fa";
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

  // Get user name from localStorage
  let userName = "Customer";
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) userName = user.username;
  } catch {}

  // Stat widgets (hardcoded for now)
  const statWidgets = [
    {
      icon: <FaClipboardList className="text-blue-400 text-2xl" />,
      label: "Total Tickets Raised",
      value: tickets.length,
      bg: "bg-white/10 backdrop-blur-md border border-white/20",
    },
    {
      icon: <FaCheckCircle className="text-green-400 text-2xl" />,
      label: "Resolved Tickets",
      value: tickets.filter(t => t.status === 'Resolved').length,
      bg: "bg-white/10 backdrop-blur-md border border-white/20",
    },
    {
      icon: <FaCommentDots className="text-pink-400 text-2xl" />,
      label: "Feedbacks Submitted",
      value: tickets.filter(t => t.type === 'Feedback').length,
      bg: "bg-white/10 backdrop-blur-md border border-white/20",
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

  // Side panel links
  const navLinks = [
    { label: "Dashboard", icon: <FaHome />, href: "#dashboard" },
    { label: "My Tickets", icon: <FaTicketAlt />, href: "#tickets" },
    { label: "Submit Feedback", icon: <FaRegCommentDots />, href: "#feedback" },
    { label: "Raise Issue", icon: <FaExclamationCircle />, href: "#issue" },
    { label: "FAQ", icon: <FaQuestionCircle />, href: "#faq" },
    { label: "Contact", icon: <FaEnvelope />, href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Side Panel */}
      <aside className="fixed left-0 top-0 bottom-0 h-screen w-64 bg-[#1e293b] shadow-2xl border-r border-gray-700 z-30"> 
        <div className="flex flex-col items-center py-8 px-4">
          <FaUserCircle className="text-5xl text-blue-400 mb-2 drop-shadow" />
          <div className="text-lg font-bold text-white mb-1">{userName}</div>
          <div className="text-xs text-gray-400 mb-4">Customer Portal</div>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-4">
          {navLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-gray-200 hover:bg-[#334155] hover:text-white transition-all">
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto flex justify-center pb-6 md:hidden">
          <button onClick={() => setSideOpen(false)} className="p-2 rounded-full bg-[#334155] hover:bg-[#475569] text-white"><FaTimes /></button>
        </div>
      </aside>
      {/* Hamburger for mobile */}
      <button className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-full bg-[#1e293b] shadow-lg hover:bg-[#334155] text-white" onClick={() => setSideOpen(true)}><FaBars /></button>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-12 transition-all duration-300 w-full ml-64">
        <div className="w-full flex flex-col gap-8">
          {/* Stat Widgets */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-start">
            {statWidgets.map((w, i) => (
              <div key={i} className="flex items-center gap-4 p-6 rounded-lg shadow-lg border-2 border-dashed border-gray-500 bg-[#1e293b] hover:scale-[1.04] hover:shadow-2xl transition-all duration-200">
                <div>{w.icon}</div>
                <div>
                  <div className="text-3xl font-extrabold text-white drop-shadow">{w.value}</div>
                  <div className="text-gray-400 text-base font-semibold mt-1">{w.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Welcome Banner */}
          <div className="w-full mb-8">
            <div className="bg-[#1e293b] border-2 border-dashed border-gray-500 rounded-lg shadow-lg p-8 flex flex-row items-start w-full">
              <div className="text-left flex-1">
                <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">Welcome, {userName}!</h1>
                <p className="text-gray-400 text-lg font-medium mb-2">How can we help you today? Access support, raise issues, and view your tickets below.</p>
              </div>
              <div className="flex-shrink-0">
                <img
                  src={signupImage}
                  alt="Dashboard illustration"
                  className="max-w-xs w-full h-auto rounded-lg shadow-lg object-contain border-2 border-dashed border-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Feedback Card */}
            <div className="col-span-1">
              <div className="bg-[#1e293b] border-2 border-dashed border-gray-500 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-200">
                <button
                  id="feedback"
                  className="w-full flex items-center justify-between px-6 py-4 focus:outline-none hover:bg-[#334155] transition-all duration-200 rounded-t-lg"
                  onClick={() => toggleSection('feedback')}
                  aria-expanded={openSection === 'feedback'}
                >
                  <span className="flex items-center gap-2 text-lg font-bold text-white">
                    <FaRegCommentDots className="text-blue-400" /> Submit Feedback
                  </span>
                  {openSection === 'feedback' ? (
                    <FaChevronUp className="text-blue-400" />
                  ) : (
                    <FaChevronDown className="text-blue-400" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openSection === 'feedback' ? 'max-h-[400px] p-6' : 'max-h-0 p-0'}`}
                >
                  {openSection === 'feedback' && (
                    <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-3 animate-fade-in">
                      <textarea
                        className="bg-[#0f172a] border border-gray-700 rounded-lg text-white px-4 py-2 min-h-[80px] focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Share your thoughts or suggestions..."
                        value={feedback}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                          setFeedbackMsg("");
                        }}
                      />
                      <button
                        type="submit"
                        className="self-end bg-blue-600 text-white font-bold rounded-lg px-6 py-2 mt-2 hover:bg-blue-700 transition-all shadow"
                      >
                        Submit Feedback
                      </button>
                      {feedbackMsg && (
                        <span className="text-sm text-green-400 font-semibold">{feedbackMsg}</span>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Raise Issue Card */}
            <div className="col-span-1">
              <div className="bg-[#1e293b] border-2 border-dashed border-gray-500 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-200">
                <button
                  id="issue"
                  className="w-full flex items-center justify-between px-6 py-4 focus:outline-none hover:bg-[#334155] transition-all duration-200 rounded-t-lg"
                  onClick={() => toggleSection('issue')}
                  aria-expanded={openSection === 'issue'}
                >
                  <span className="flex items-center gap-2 text-lg font-bold text-white">
                    <FaExclamationCircle className="text-yellow-400" /> Raise an Issue
                  </span>
                  {openSection === 'issue' ? (
                    <FaChevronUp className="text-yellow-400" />
                  ) : (
                    <FaChevronDown className="text-yellow-400" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openSection === 'issue' ? 'max-h-[600px] p-6' : 'max-h-0 p-0'}`}
                >
                  {openSection === 'issue' && (
                    <form onSubmit={handleIssueSubmit} className="flex flex-col gap-4 animate-fade-in">
                      <div>
                        <label className="block text-sm font-bold text-white mb-1">Name</label>
                        <input
                          type="text"
                          className={`bg-[#0f172a] border border-gray-700 rounded-lg text-white px-4 py-2 w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all ${issueErrors.name ? "border-red-400 focus:ring-red-200" : ""}`}
                          value={issue.name}
                          onChange={(e) => setIssue({ ...issue, name: e.target.value })}
                        />
                        {issueErrors.name && <span className="text-xs text-red-400 font-semibold">{issueErrors.name}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-1">Email</label>
                        <input
                          type="email"
                          className={`bg-[#0f172a] border border-gray-700 rounded-lg text-white px-4 py-2 w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all ${issueErrors.email ? "border-red-400 focus:ring-red-200" : ""}`}
                          value={issue.email}
                          onChange={(e) => setIssue({ ...issue, email: e.target.value })}
                        />
                        {issueErrors.email && <span className="text-xs text-red-400 font-semibold">{issueErrors.email}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-1">Issue Type</label>
                        <select
                          className="bg-[#0f172a] border border-gray-700 rounded-lg text-white px-4 py-2 w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                          value={issue.type}
                          onChange={(e) => setIssue({ ...issue, type: e.target.value })}
                        >
                          {issueTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-1">Description</label>
                        <textarea
                          className={`bg-[#0f172a] border border-gray-700 rounded-lg text-white px-4 py-2 w-full min-h-[60px] focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all ${issueErrors.description ? "border-red-400 focus:ring-red-200" : ""}`}
                          value={issue.description}
                          onChange={(e) => setIssue({ ...issue, description: e.target.value })}
                        />
                        {issueErrors.description && <span className="text-xs text-red-400 font-semibold">{issueErrors.description}</span>}
                      </div>
                      <button
                        type="submit"
                        className="self-end bg-blue-600 text-white font-bold rounded-lg px-6 py-2 mt-2 hover:bg-blue-700 transition-all shadow"
                      >
                        Submit Issue
                      </button>
                      {issueMsg && (
                        <span className="text-sm text-green-400 font-semibold">{issueMsg}</span>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* FAQ Card */}
            <div className="col-span-1">
              <div className="bg-[#1e293b] border-2 border-dashed border-gray-500 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-200">
                <button
                  id="faq"
                  className="w-full flex items-center justify-between px-6 py-4 focus:outline-none hover:bg-[#334155] transition-all duration-200 rounded-t-lg"
                  onClick={() => toggleSection('faq')}
                  aria-expanded={openSection === 'faq'}
                >
                  <span className="flex items-center gap-2 text-lg font-bold text-white">
                    <FaQuestionCircle className="text-green-400" /> FAQ
                  </span>
                  {openSection === 'faq' ? (
                    <FaChevronUp className="text-green-400" />
                  ) : (
                    <FaChevronDown className="text-green-400" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openSection === 'faq' ? 'max-h-[600px] p-6' : 'max-h-0 p-0'}`}
                >
                  {openSection === 'faq' && (
                    <div className="divide-y divide-gray-700 animate-fade-in">
                      {faqs.map((faq, idx) => (
                        <div key={idx} className="py-3">
                          <button
                            className="w-full text-left flex justify-between items-center focus:outline-none hover:text-blue-400 transition-colors"
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            aria-expanded={openFaq === idx}
                          >
                            <span className="font-semibold text-white">{faq.question}</span>
                            <span className="ml-2 text-blue-400">{openFaq === idx ? <FaChevronUp /> : <FaChevronDown />}</span>
                          </button>
                          {openFaq === idx && (
                            <div className="mt-2 text-gray-400 text-sm animate-fade-in">{faq.answer}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tickets and Contact Row */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* My Tickets Card */}
            <div className="col-span-2">
              <div className="bg-[#1e293b] border-2 border-dashed border-gray-500 rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-200 flex flex-col items-center justify-center min-h-[320px]">
                <div className="flex items-center gap-2 mb-4">
                  <FaTicketAlt className="text-pink-400 text-xl" />
                  <h2 className="text-xl font-bold text-white">My Tickets & Previous Feedback</h2>
                </div>
                {tickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full h-full py-8">
                    <p className="text-lg text-gray-400 font-semibold mb-2">You haven’t submitted any feedback or raised any issues yet.</p>
                    <img
                      src={signupImage}
                      alt="No tickets yet"
                      className="max-w-sm w-full h-auto mb-4 rounded-lg shadow-md object-contain mx-auto border-2 border-dashed border-gray-500"
                    />
                    <p className="text-blue-400 mb-2 text-center">Start by submitting feedback or raising your first issue using the cards above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                          <th className="py-2 pr-4 font-bold">ID</th>
                          <th className="py-2 pr-4 font-bold">Type</th>
                          <th className="py-2 pr-4 font-bold">Subject</th>
                          <th className="py-2 pr-4 font-bold">Status</th>
                          <th className="py-2 pr-4 font-bold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((t) => (
                          <tr key={t.id} className="border-b border-gray-700 hover:bg-[#22304a] transition-colors">
                            <td className="py-2 pr-4 text-white font-mono">{t.id}</td>
                            <td className="py-2 pr-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'Issue' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'}`}>{t.type}</span>
                            </td>
                            <td className="py-2 pr-4 text-white">{t.subject}</td>
                            <td className="py-2 pr-4">
                              {t.status === 'Resolved' && <span className="flex items-center gap-1 text-green-400"><FaCheckCircle /> Resolved</span>}
                              {t.status === 'Open' && <span className="flex items-center gap-1 text-red-400"><FaExclamationCircle /> Open</span>}
                              {t.status === 'In Progress' && <span className="flex items-center gap-1 text-yellow-300"><FaQuestionCircle /> In Progress</span>}
                            </td>
                            <td className="py-2 pr-4 text-gray-400">{t.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Help & Contact Card */}
            <div className="col-span-1">
              <div className="bg-[#1e293b] border-2 border-dashed border-gray-500 rounded-lg shadow-lg p-8 flex flex-col gap-2 hover:shadow-2xl transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaEnvelope className="text-blue-400 text-xl" />
                  <span className="text-white font-bold">Email:</span>
                  <span className="text-gray-400">support@company.com</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FaPhoneAlt className="text-green-400 text-xl" />
                  <span className="text-white font-bold">Phone:</span>
                  <span className="text-gray-400">+1 (800) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">Support Hours:</span>
                  <span className="text-gray-400">Mon–Fri, 9am–6pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 