import { useState, useEffect } from "react";
import Sidebar from "../../components/po/Sidebar";
import IssueCard from "../../components/po/IssueCard";
import IssueModal from "../../components/po/IssueModal";
import IssueFilters from "../../components/po/IssueFilters";
import IssueSearchBar from "../../components/po/IssueSearchBar";
import IssueStats from "../../components/po/IssueStats";
import { FaBug, FaPlus, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock, FaUsers } from "react-icons/fa";

// Mock data - will be replaced with API calls
const mockIssues = [
  {
    id: "ISS-001",
    title: "Login Authentication Failure",
    description: "Users unable to login with correct credentials. Getting 'Invalid credentials' error even with valid username/password combination. This has been affecting multiple users since yesterday.",
    category: "Login",
    priority: "Critical",
    status: "Open",
    createdAt: "2025-01-24T10:30:00Z",
    updatedAt: "2025-01-24T14:20:00Z",
    clientId: "client_1",
    clientName: "TechCorp Solutions",
    reportedBy: "john.smith@techcorp.com",
    assignedTo: "Sarah Wilson",
    resolvedAt: null,
    comments: [
      {
        text: "Investigating the authentication service logs",
        author: "Sarah Wilson",
        timestamp: "2025-01-24T11:00:00Z"
      }
    ]
  },
  {
    id: "ISS-002",
    title: "Dashboard Charts Not Loading",
    description: "Analytics dashboard showing empty charts. Data is available in the database but visualization components are not rendering properly.",
    category: "UI Bug",
    priority: "High",
    status: "In Progress",
    createdAt: "2025-01-23T09:15:00Z",
    updatedAt: "2025-01-24T16:45:00Z",
    clientId: "client_2",
    clientName: "RetailMax",
    reportedBy: "admin@retailmax.com",
    assignedTo: "Mike Johnson",
    resolvedAt: null,
    comments: [
      {
        text: "Found the issue with the chart library configuration",
        author: "Mike Johnson",
        timestamp: "2025-01-24T16:45:00Z"
      }
    ]
  },
  {
    id: "ISS-003",
    title: "API Integration Timeout",
    description: "Third-party API integration timing out after 30 seconds. Need to increase timeout or implement retry mechanism.",
    category: "Integration",
    priority: "Medium",
    status: "Resolved",
    createdAt: "2025-01-22T14:20:00Z",
    updatedAt: "2025-01-24T13:30:00Z",
    clientId: "client_3",
    clientName: "StartupHub",
    reportedBy: "developer@startuphub.com",
    assignedTo: "Lisa Chen",
    resolvedAt: "2025-01-24T13:30:00Z",
    comments: [
      {
        text: "Implemented retry mechanism with exponential backoff",
        author: "Lisa Chen",
        timestamp: "2025-01-24T13:30:00Z"
      }
    ]
  },
  {
    id: "ISS-004",
    title: "Database Connection Pool Exhausted",
    description: "Application running out of database connections during peak hours. Need to optimize connection pooling settings.",
    category: "Database",
    priority: "High",
    status: "Open",
    createdAt: "2025-01-24T08:45:00Z",
    updatedAt: "2025-01-24T08:45:00Z",
    clientId: "client_4",
    clientName: "ServicePro Inc",
    reportedBy: "support@servicepro.com",
    assignedTo: "David Brown",
    resolvedAt: null,
    comments: []
  },
  {
    id: "ISS-005",
    title: "Role Permission Mismatch",
    description: "Users with 'Manager' role unable to access reports section. Permission settings seem to be incorrectly configured.",
    category: "Access Control",
    priority: "Medium",
    status: "Reopened",
    createdAt: "2025-01-21T16:30:00Z",
    updatedAt: "2025-01-24T12:15:00Z",
    clientId: "client_2",
    clientName: "RetailMax",
    reportedBy: "manager@retailmax.com",
    assignedTo: "Sarah Wilson",
    resolvedAt: null,
    comments: [
      {
        text: "Fixed permission settings",
        author: "Sarah Wilson",
        timestamp: "2025-01-23T14:00:00Z"
      },
      {
        text: "Issue still persists for some users",
        author: "manager@retailmax.com",
        timestamp: "2025-01-24T12:15:00Z"
      }
    ]
  },
  {
    id: "ISS-006",
    title: "Email Notifications Not Sending",
    description: "System not sending email notifications for important events. SMTP configuration might be incorrect.",
    category: "Email",
    priority: "Low",
    status: "Resolved",
    createdAt: "2025-01-20T11:20:00Z",
    updatedAt: "2025-01-23T15:45:00Z",
    clientId: "client_1",
    clientName: "TechCorp Solutions",
    reportedBy: "admin@techcorp.com",
    assignedTo: "Mike Johnson",
    resolvedAt: "2025-01-23T15:45:00Z",
    comments: [
      {
        text: "Updated SMTP server configuration",
        author: "Mike Johnson",
        timestamp: "2025-01-23T15:45:00Z"
      }
    ]
  }
];

const teamMembers = [
  "Sarah Wilson",
  "Mike Johnson", 
  "Lisa Chen",
  "David Brown",
  "Alex Rodriguez",
  "Emma Davis"
];

export default function Issues() {
  const [issues, setIssues] = useState(mockIssues);
  const [filteredIssues, setFilteredIssues] = useState(mockIssues);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("open"); // "open" or "resolved"
  const [filters, setFilters] = useState({
    priority: "all",
    category: "all",
    assignedTo: "all",
    client: "all"
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = issues;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.priority !== "all") {
      filtered = filtered.filter(issue => issue.priority === filters.priority);
    }
    if (filters.category !== "all") {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }
    if (filters.assignedTo !== "all") {
      filtered = filtered.filter(issue => issue.assignedTo === filters.assignedTo);
    }
    if (filters.client !== "all") {
      filtered = filtered.filter(issue => issue.clientName === filters.client);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, filters]);

  const openIssues = filteredIssues.filter(issue => 
    issue.status === "Open" || issue.status === "In Progress" || issue.status === "Reopened"
  );
  const resolvedIssues = filteredIssues.filter(issue => issue.status === "Resolved");

  const handleCreateIssue = () => {
    setSelectedIssue(null);
    setIsCreating(true);
    setShowIssueModal(true);
  };

  const handleEditIssue = (issue) => {
    setSelectedIssue(issue);
    setIsCreating(false);
    setShowIssueModal(true);
  };

  const handleSaveIssue = (issueData) => {
    if (isCreating) {
      const newIssue = {
        ...issueData,
        id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resolvedAt: issueData.status === "Resolved" ? new Date().toISOString() : null,
        comments: []
      };
      setIssues([newIssue, ...issues]);
    } else {
      const updatedIssues = issues.map(issue =>
        issue.id === selectedIssue.id
          ? {
              ...issue,
              ...issueData,
              updatedAt: new Date().toISOString(),
              resolvedAt: issueData.status === "Resolved" && issue.status !== "Resolved" 
                ? new Date().toISOString() 
                : issue.resolvedAt
            }
          : issue
      );
      setIssues(updatedIssues);
    }
    setShowIssueModal(false);
  };

  const handleDeleteIssue = (issueId) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      setIssues(issues.filter(issue => issue.id !== issueId));
    }
  };

  const handleStatusChange = (issueId, newStatus) => {
    const updatedIssues = issues.map(issue =>
      issue.id === issueId
        ? {
            ...issue,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            resolvedAt: newStatus === "Resolved" ? new Date().toISOString() : null
          }
        : issue
    );
    setIssues(updatedIssues);
  };

  const getIssueStats = () => {
    const total = issues.length;
    const open = issues.filter(i => i.status === "Open").length;
    const inProgress = issues.filter(i => i.status === "In Progress").length;
    const resolved = issues.filter(i => i.status === "Resolved").length;
    const critical = issues.filter(i => i.priority === "Critical" && i.status !== "Resolved").length;
    
    return { total, open, inProgress, resolved, critical };
  };

  const stats = getIssueStats();

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar />
      
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 ml-[60px] sm:ml-[60px] lg:ml-[60px]">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaBug className="text-red-400 text-xl sm:text-2xl" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Issue Tracker</h1>
                <p className="text-sm sm:text-base text-gray-400">Track and manage client issues across all systems</p>
              </div>
            </div>
            
            <button
              onClick={handleCreateIssue}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <FaPlus />
              <span className="hidden sm:inline">Raise New Issue</span>
              <span className="sm:hidden">New Issue</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <IssueStats stats={stats} />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <IssueSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          <div className="w-full sm:w-auto">
            <IssueFilters
              filters={filters}
              onFiltersChange={setFilters}
              issues={issues}
              teamMembers={teamMembers}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("open")}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "open"
                ? "text-blue-400 border-blue-400"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            <FaExclamationTriangle />
            Open Issues ({openIssues.length})
          </button>
          <button
            onClick={() => setActiveTab("resolved")}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "resolved"
                ? "text-green-400 border-green-400"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            <FaCheckCircle />
            Resolved Issues ({resolvedIssues.length})
          </button>
        </div>

        {/* Issues Display */}
        <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
          {activeTab === "open" ? (
            <div className="divide-y divide-gray-700">
              {openIssues.length > 0 ? (
                openIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onEdit={handleEditIssue}
                    onDelete={handleDeleteIssue}
                    onStatusChange={handleStatusChange}
                    teamMembers={teamMembers}
                  />
                ))
              ) : (
                <div className="text-center py-16">
                  <FaCheckCircle className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No open issues found</h3>
                  <p className="text-gray-500">
                    {filteredIssues.length === 0 
                      ? "No issues match your current search and filter criteria" 
                      : "All issues have been resolved!"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {resolvedIssues.length > 0 ? (
                resolvedIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onEdit={handleEditIssue}
                    onDelete={handleDeleteIssue}
                    onStatusChange={handleStatusChange}
                    teamMembers={teamMembers}
                  />
                ))
              ) : (
                <div className="text-center py-16">
                  <FaClock className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No resolved issues found</h3>
                  <p className="text-gray-500">
                    No issues have been resolved yet that match your criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Issue Modal */}
        <IssueModal
          isOpen={showIssueModal}
          issue={selectedIssue}
          isCreating={isCreating}
          onClose={() => setShowIssueModal(false)}
          onSave={handleSaveIssue}
          teamMembers={teamMembers}
          clients={[...new Set(issues.map(i => i.clientName))]}
        />
      </main>
    </div>
  );
}