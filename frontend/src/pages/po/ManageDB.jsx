import { useState, useEffect } from "react";
import Sidebar from "../../components/po/Sidebar";
import DatabaseCard from "../../components/po/DatabaseCard";
import DatabaseSearchBar from "../../components/po/DatabaseSearchBar";
import DatabaseFilters from "../../components/po/DatabaseFilters";
import SchemaModal from "../../components/po/SchemaModal";
import { FaDatabase, FaExclamationTriangle, FaChartPie } from "react-icons/fa";

// Mock data - will be replaced with API calls
const mockClientDBData = [
  {
    id: "1",
    clientId: "1",
    clientName: "TechCorp Solutions",
    clientType: "Product-based",
    dbType: "MongoDB",
    usedStorage: 2.4, // GB
    totalStorage: 5.0, // GB
    storagePercentage: 48,
    status: "healthy", // healthy, warning, critical
    tables: {
      users: { 
        count: 1250, 
        fields: ["name", "email", "role", "lastLogin", "avatar"],
        lastUpdated: "2024-07-24T10:30:00Z"
      },
      products: { 
        count: 340, 
        fields: ["title", "price", "stock", "category", "description"],
        lastUpdated: "2024-07-24T09:15:00Z"
      },
      feedback: { 
        count: 89,
        fields: ["userId", "rating", "comment", "createdAt"],
        lastUpdated: "2024-07-24T11:20:00Z"
      },
      tickets: { 
        count: 156,
        fields: ["userId", "subject", "status", "priority", "createdAt"],
        lastUpdated: "2024-07-24T12:00:00Z"
      }
    },
    connectionStatus: "active",
    lastBackup: "2024-07-23T02:00:00Z",
    updatedAt: "2024-07-24T12:05:00Z"
  },
  {
    id: "2",
    clientId: "2",
    clientName: "ServicePro Inc",
    clientType: "Service-based",
    dbType: "PostgreSQL",
    usedStorage: 4.2,
    totalStorage: 5.0,
    storagePercentage: 84,
    status: "warning",
    tables: {
      users: { 
        count: 890, 
        fields: ["name", "email", "role", "department", "lastLogin"],
        lastUpdated: "2024-07-24T10:45:00Z"
      },
      services: { 
        count: 125, 
        fields: ["title", "description", "duration", "price", "category"],
        lastUpdated: "2024-07-24T09:30:00Z"
      },
      appointments: { 
        count: 2340, 
        fields: ["userId", "serviceId", "dateTime", "status", "notes"],
        lastUpdated: "2024-07-24T12:10:00Z"
      },
      feedback: { 
        count: 234,
        fields: ["userId", "serviceId", "rating", "comment", "createdAt"],
        lastUpdated: "2024-07-24T11:45:00Z"
      },
      tickets: { 
        count: 67,
        fields: ["userId", "subject", "status", "priority", "assignedTo"],
        lastUpdated: "2024-07-24T12:02:00Z"
      }
    },
    connectionStatus: "active",
    lastBackup: "2024-07-23T02:00:00Z",
    updatedAt: "2024-07-24T12:12:00Z"
  },
  {
    id: "3",
    clientId: "3",
    clientName: "RetailMax",
    clientType: "Product-based",
    dbType: "MongoDB",
    usedStorage: 4.7,
    totalStorage: 5.0,
    storagePercentage: 94,
    status: "critical",
    tables: {
      users: { 
        count: 3200, 
        fields: ["name", "email", "phone", "address", "membershipLevel"],
        lastUpdated: "2024-07-24T11:00:00Z"
      },
      products: { 
        count: 1580, 
        fields: ["name", "sku", "price", "stock", "category", "images"],
        lastUpdated: "2024-07-24T10:20:00Z"
      },
      orders: { 
        count: 5670, 
        fields: ["userId", "items", "total", "status", "shippingAddress"],
        lastUpdated: "2024-07-24T12:15:00Z"
      },
      feedback: { 
        count: 892,
        fields: ["userId", "productId", "rating", "review", "createdAt"],
        lastUpdated: "2024-07-24T11:30:00Z"
      },
      tickets: { 
        count: 203,
        fields: ["userId", "orderId", "issue", "status", "resolution"],
        lastUpdated: "2024-07-24T12:08:00Z"
      }
    },
    connectionStatus: "active",
    lastBackup: "2024-07-22T02:00:00Z",
    updatedAt: "2024-07-24T12:18:00Z"
  },
  {
    id: "4",
    clientId: "4",
    clientName: "StartupHub",
    clientType: "Service-based",
    dbType: "Firebase",
    usedStorage: 1.2,
    totalStorage: 3.0,
    storagePercentage: 40,
    status: "healthy",
    tables: {
      users: { 
        count: 450, 
        fields: ["displayName", "email", "photoURL", "lastSignIn"],
        lastUpdated: "2024-07-24T09:45:00Z"
      },
      projects: { 
        count: 78, 
        fields: ["title", "description", "status", "createdBy", "team"],
        lastUpdated: "2024-07-24T10:30:00Z"
      },
      feedback: { 
        count: 34,
        fields: ["userId", "projectId", "rating", "comment"],
        lastUpdated: "2024-07-24T11:10:00Z"
      }
    },
    connectionStatus: "active",
    lastBackup: "2024-07-23T02:00:00Z",
    updatedAt: "2024-07-24T11:25:00Z"
  }
];

export default function POManageDB() {
  const [dbData, setDbData] = useState(mockClientDBData);
  const [filteredData, setFilteredData] = useState(mockClientDBData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dbType: "all",
    clientType: "all",
    storageLevel: "all"
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter and search logic
  useEffect(() => {
    let filtered = dbData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply database type filter
    if (filters.dbType !== "all") {
      filtered = filtered.filter(client => client.dbType === filters.dbType);
    }

    // Apply client type filter
    if (filters.clientType !== "all") {
      filtered = filtered.filter(client => client.clientType === filters.clientType);
    }

    // Apply storage level filter
    if (filters.storageLevel !== "all") {
      filtered = filtered.filter(client => {
        switch (filters.storageLevel) {
          case "critical":
            return client.storagePercentage >= 90;
          case "warning":
            return client.storagePercentage >= 60 && client.storagePercentage < 90;
          case "healthy":
            return client.storagePercentage < 60;
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);
  }, [dbData, searchTerm, filters]);

  const handleViewSchema = (client) => {
    setSelectedClient(client);
    setShowSchemaModal(true);
  };

  const getStorageStats = () => {
    const total = dbData.length;
    const critical = dbData.filter(c => c.storagePercentage >= 90).length;
    const warning = dbData.filter(c => c.storagePercentage >= 60 && c.storagePercentage < 90).length;
    const healthy = dbData.filter(c => c.storagePercentage < 60).length;
    
    return { total, critical, warning, healthy };
  };

  const stats = getStorageStats();

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar />
      
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 ml-[60px]">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <FaDatabase className="text-green-400 text-xl sm:text-2xl" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Database Management</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-400">Monitor client database usage, storage, and schema management</p>
        </div>

        {/* Storage Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaDatabase className="text-blue-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Databases</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-red-400">{stats.critical}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Critical ({'>'}90%)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaExclamationTriangle className="text-yellow-400 text-lg sm:text-xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.warning}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Warning (60-90%)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.healthy}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Healthy ({'<'}60%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <DatabaseSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          <div className="w-full sm:w-auto">
            <DatabaseFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </div>

        {/* Database Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16">
            <FaDatabase className="text-4xl sm:text-5xl md:text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No databases found</h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              {searchTerm || Object.values(filters).some(f => f !== "all") 
                ? "Try adjusting your search or filter criteria" 
                : "No client databases are currently configured"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredData.map(client => (
              <DatabaseCard
                key={client.id}
                client={client}
                onViewSchema={() => handleViewSchema(client)}
              />
            ))}
          </div>
        )}

        {/* Schema Modal */}
        <SchemaModal
          isOpen={showSchemaModal}
          client={selectedClient}
          onClose={() => {
            setShowSchemaModal(false);
            setSelectedClient(null);
          }}
        />
      </main>
    </div>
  );
} 