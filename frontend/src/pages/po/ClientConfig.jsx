import { useState, useEffect } from "react";
import Sidebar from "../../components/po/Sidebar";
import ClientCard from "../../components/po/ClientCard";
import ClientFormModal from "../../components/po/ClientFormModal";
import SearchBar from "../../components/po/SearchBar";
import FilterToggle from "../../components/po/FilterToggle";
import { FaPlus, FaUsers, FaCog } from "react-icons/fa";

// Mock data for now - will be replaced with API calls
const mockClients = [
  {
    id: "1",
    clientName: "TechCorp Solutions",
    clientType: "Product-based",
    username: "techcorp_admin",
    features: {
      feedback: true,
      dashboard: true,
      ticketing: true,
      customerChat: false,
      orders: true,
      analytics: true,
      reports: false,
      support: true
    },
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    clientName: "ServicePro Inc",
    clientType: "Service-based",
    username: "servicepro_admin",
    features: {
      feedback: true,
      dashboard: true,
      ticketing: true,
      customerChat: true,
      orders: false,
      analytics: false,
      reports: true,
      support: true
    },
    isActive: true,
    createdAt: "2024-02-20T14:45:00Z"
  },
  {
    id: "3",
    clientName: "RetailMax",
    clientType: "Product-based",
    username: "retailmax_admin",
    features: {
      feedback: false,
      dashboard: true,
      ticketing: false,
      customerChat: true,
      orders: true,
      analytics: true,
      reports: true,
      support: false
    },
    isActive: false,
    createdAt: "2024-03-10T09:15:00Z"
  }
];

export default function POClientConfig() {
  const [clients, setClients] = useState(mockClients);
  const [filteredClients, setFilteredClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter and search logic
  useEffect(() => {
    let filtered = clients;

    // Apply type filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(client => client.clientType === selectedFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, selectedFilter]);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const handleSaveClient = (clientData) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map(client =>
        client.id === editingClient.id
          ? { ...client, ...clientData }
          : client
      ));
    } else {
      // Add new client
      const newClient = {
        id: Date.now().toString(),
        ...clientData,
        createdAt: new Date().toISOString()
      };
      setClients([...clients, newClient]);
    }
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleToggleClientStatus = (clientId) => {
    setClients(clients.map(client =>
      client.id === clientId
        ? { ...client, isActive: !client.isActive }
        : client
    ));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar />
      
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 ml-[60px]">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <FaCog className="text-blue-400 text-xl sm:text-2xl" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Client Configuration</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-400">Manage your clients and their feature access</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaUsers className="text-blue-400 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{clients.length}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Clients</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {clients.filter(c => c.isActive).length}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">Active Clients</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {clients.filter(c => c.clientType === "Product-based").length}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">Product-based</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1e293b] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {clients.filter(c => c.clientType === "Service-based").length}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">Service-based</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search clients by name or username..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <FilterToggle
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
            <button
              onClick={handleAddClient}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
            >
              <FaPlus />
              <span className="hidden sm:inline">Add Client</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Clients Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-16">
            <FaUsers className="text-4xl sm:text-5xl md:text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No clients found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">
              {searchTerm || selectedFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Get started by adding your first client"}
            </p>
            {!searchTerm && selectedFilter === "all" && (
              <button
                onClick={handleAddClient}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
              >
                Add Your First Client
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredClients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={() => handleEditClient(client)}
                onDelete={() => handleDeleteClient(client.id)}
                onToggleStatus={() => handleToggleClientStatus(client.id)}
              />
            ))}
          </div>
        )}

        {/* Client Form Modal */}
        <ClientFormModal
          isOpen={isModalOpen}
          client={editingClient}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
        />
      </main>
    </div>
  );
} 