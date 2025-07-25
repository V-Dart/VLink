import { FaFilter, FaCalendarAlt } from "react-icons/fa";

export default function LogFilters({ filters, onFiltersChange, logs }) {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  // Extract unique values for dropdown options
  const uniqueClients = [...new Set(logs.map(log => log.clientName))].sort();
  const uniqueModules = [...new Set(logs.map(log => log.module))].sort();
  const uniqueRoles = [...new Set(logs.map(log => log.triggeredBy.role))].sort();

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "success", label: "Success" },
    { value: "error", label: "Error" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" }
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {/* Client Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">Client:</span>
        <select
          value={filters.client}
          onChange={(e) => handleFilterChange('client', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[140px]"
        >
          <option value="all">All Clients</option>
          {uniqueClients.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>
      </div>

      {/* Module Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">Module:</span>
        <select
          value={filters.module}
          onChange={(e) => handleFilterChange('module', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[130px]"
        >
          <option value="all">All Modules</option>
          {uniqueModules.map((module) => (
            <option key={module} value={module}>
              {module}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">Status:</span>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[110px]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Role Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">Role:</span>
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[110px]"
        >
          <option value="all">All Roles</option>
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <FaCalendarAlt className="text-gray-400 text-xs sm:text-sm" />
          <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap sm:hidden lg:inline">Date:</span>
        </div>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[120px]"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {Object.values(filters).some(filter => filter !== "all" && filter !== "today") && (
        <div className="col-span-full flex justify-center sm:justify-end mt-2 sm:mt-0">
          <button
            onClick={() => onFiltersChange({ 
              client: "all", 
              module: "all", 
              status: "all", 
              role: "all", 
              dateRange: "today" 
            })}
            className="px-3 sm:px-4 py-2 sm:py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
