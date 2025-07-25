import { useState, useEffect } from "react";
import Sidebar from "../../components/po/Sidebar";
import LogTable from "../../components/po/LogTable";
import LogFilters from "../../components/po/LogFilters";
import LogSearchBar from "../../components/po/LogSearchBar";
import LogModal from "../../components/po/LogModal";
import { FaFileAlt, FaPlay, FaPause, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

// Mock data - will be replaced with API calls
const mockLogs = [
  {
    id: "1",
    timestamp: "2024-07-25T11:04:22.000Z",
    event: "User Login",
    triggeredBy: {
      userId: "user_001",
      username: "john.doe",
      role: "admin"
    },
    clientId: "client_001",
    clientName: "TechCorp Solutions",
    module: "Authentication",
    status: "success",
    details: "Admin user logged in successfully from IP 192.168.1.100",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    createdAt: "2024-07-25T11:04:22.000Z"
  },
  {
    id: "2",
    timestamp: "2024-07-25T11:03:15.000Z",
    event: "Product Updated",
    triggeredBy: {
      userId: "user_005",
      username: "sarah.wilson",
      role: "client"
    },
    clientId: "client_002",
    clientName: "ServicePro Inc",
    module: "Product Management",
    status: "success",
    details: "Product 'Premium Service Package' updated - price changed from $199 to $249",
    ipAddress: "203.45.67.89",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    createdAt: "2024-07-25T11:03:15.000Z"
  },
  {
    id: "3",
    timestamp: "2024-07-25T11:02:45.000Z",
    event: "Database Connection Failed",
    triggeredBy: {
      userId: "system",
      username: "system",
      role: "system"
    },
    clientId: "client_003",
    clientName: "RetailMax",
    module: "Database",
    status: "error",
    details: "Connection timeout after 30 seconds. Retrying connection...",
    ipAddress: "N/A",
    userAgent: "Internal System",
    createdAt: "2024-07-25T11:02:45.000Z"
  },
  {
    id: "4",
    timestamp: "2024-07-25T11:01:30.000Z",
    event: "Customer Registration",
    triggeredBy: {
      userId: "cust_789",
      username: "mike.johnson",
      role: "customer"
    },
    clientId: "client_001",
    clientName: "TechCorp Solutions",
    module: "Customer Portal",
    status: "success",
    details: "New customer registered: mike.johnson@email.com",
    ipAddress: "156.78.90.123",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
    createdAt: "2024-07-25T11:01:30.000Z"
  },
  {
    id: "5",
    timestamp: "2024-07-25T11:00:12.000Z",
    event: "Payment Processing",
    triggeredBy: {
      userId: "cust_456",
      username: "emily.brown",
      role: "customer"
    },
    clientId: "client_002",
    clientName: "ServicePro Inc",
    module: "Payment Gateway",
    status: "warning",
    details: "Payment declined - insufficient funds. Customer notified.",
    ipAddress: "78.45.123.67",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    createdAt: "2024-07-25T11:00:12.000Z"
  },
  {
    id: "6",
    timestamp: "2024-07-25T10:59:33.000Z",
    event: "Ticket Created",
    triggeredBy: {
      userId: "cust_321",
      username: "alex.davis",
      role: "customer"
    },
    clientId: "client_003",
    clientName: "RetailMax",
    module: "Support System",
    status: "info",
    details: "Support ticket #1024 created: 'Issue with order delivery'",
    ipAddress: "145.67.89.101",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    createdAt: "2024-07-25T10:59:33.000Z"
  },
  {
    id: "7",
    timestamp: "2024-07-25T10:58:45.000Z",
    event: "Data Export",
    triggeredBy: {
      userId: "user_002",
      username: "admin.jones",
      role: "admin"
    },
    clientId: "client_001",
    clientName: "TechCorp Solutions",
    module: "Analytics",
    status: "success",
    details: "Customer data exported to CSV (2,450 records)",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    createdAt: "2024-07-25T10:58:45.000Z"
  },
  {
    id: "8",
    timestamp: "2024-07-25T10:57:22.000Z",
    event: "Profile Update Failed",
    triggeredBy: {
      userId: "cust_654",
      username: "lisa.white",
      role: "customer"
    },
    clientId: "client_002",
    clientName: "ServicePro Inc",
    module: "Profile Management",
    status: "error",
    details: "Validation error: Invalid phone number format",
    ipAddress: "89.123.45.67",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)",
    createdAt: "2024-07-25T10:57:22.000Z"
  }
];

export default function POLogs() {
  const [logs, setLogs] = useState(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    client: "all",
    module: "all",
    status: "all",
    role: "all",
    dateRange: "today"
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [isLiveView, setIsLiveView] = useState(true);
  const [loading, setLoading] = useState(false);

  // Simulate real-time log updates
  useEffect(() => {
    if (!isLiveView) return;

    const interval = setInterval(() => {
      // Simulate new log entries
      const newLogEvents = [
        "User Login", "User Logout", "Data Updated", "File Upload", "Payment Processed",
        "Order Created", "Ticket Resolved", "Profile Updated", "Settings Changed"
      ];
      const statuses = ["success", "error", "warning", "info"];
      const modules = ["Authentication", "Dashboard", "Orders", "Support", "Analytics"];
      const clients = ["TechCorp Solutions", "ServicePro Inc", "RetailMax", "StartupHub"];
      
      const randomEvent = newLogEvents[Math.floor(Math.random() * newLogEvents.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        event: randomEvent,
        triggeredBy: {
          userId: "user_" + Math.floor(Math.random() * 1000),
          username: "user.demo",
          role: ["admin", "client", "customer", "system"][Math.floor(Math.random() * 4)]
        },
        clientId: "client_" + Math.floor(Math.random() * 10),
        clientName: clients[Math.floor(Math.random() * clients.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        status: randomStatus,
        details: `${randomEvent} - Simulated log entry for demonstration`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Demo Browser",
        createdAt: new Date().toISOString()
      };
      
      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 49)]); // Keep only 50 latest logs
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLiveView]);

  // Filter and search logic
  useEffect(() => {
    let filtered = logs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.triggeredBy.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.client !== "all") {
      filtered = filtered.filter(log => log.clientName === filters.client);
    }
    if (filters.module !== "all") {
      filtered = filtered.filter(log => log.module === filters.module);
    }
    if (filters.status !== "all") {
      filtered = filtered.filter(log => log.status === filters.status);
    }
    if (filters.role !== "all") {
      filtered = filtered.filter(log => log.triggeredBy.role === filters.role);
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
      }
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, filters]);

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  const getStatusStats = () => {
    const success = logs.filter(log => log.status === "success").length;
    const error = logs.filter(log => log.status === "error").length;
    const warning = logs.filter(log => log.status === "warning").length;
    const info = logs.filter(log => log.status === "info").length;
    
    return { success, error, warning, info, total: logs.length };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar />
      
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 ml-[60px] sm:ml-[60px] lg:ml-[60px]">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-blue-400 text-xl sm:text-2xl" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">System Logs</h1>
                <p className="text-sm sm:text-base text-gray-400">Real-time activity monitoring across all clients</p>
              </div>
            </div>
            
            {/* Live View Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm hidden sm:inline">Live View:</span>
              <button
                onClick={() => setIsLiveView(!isLiveView)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  isLiveView 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                {isLiveView ? <FaPause /> : <FaPlay />}
                {isLiveView ? "Live" : "Paused"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaFileAlt className="text-blue-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Logs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaCheckCircle className="text-green-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.success}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Success</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-red-400">{stats.error}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Errors</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaExclamationTriangle className="text-yellow-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.warning}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Warnings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaInfoCircle className="text-blue-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-blue-400">{stats.info}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Info</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <LogSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          <div className="w-full sm:w-auto">
            <LogFilters
              filters={filters}
              onFiltersChange={setFilters}
              logs={logs}
            />
          </div>
        </div>

        {/* Log Table */}
        <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
          <LogTable
            logs={filteredLogs}
            onViewLog={handleViewLog}
            loading={loading}
            isLiveView={isLiveView}
          />
        </div>

        {/* Log Detail Modal */}
        <LogModal
          isOpen={showLogModal}
          log={selectedLog}
          onClose={() => {
            setShowLogModal(false);
            setSelectedLog(null);
          }}
        />
      </main>
    </div>
  );
} 