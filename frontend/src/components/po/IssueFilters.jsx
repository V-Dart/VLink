import { FaFilter } from "react-icons/fa";

export default function IssueFilters({ filters, onFiltersChange, issues, teamMembers }) {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  // Extract unique values for dropdown options
  const uniqueClients = [...new Set(issues.map(issue => issue.clientName))].sort();
  const uniqueCategories = [...new Set(issues.map(issue => issue.category))].sort();

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "Critical", label: "Critical" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" }
  ];

  const clearAllFilters = () => {
    onFiltersChange({
      priority: "all",
      category: "all",
      assignedTo: "all",
      client: "all"
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== "all");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {/* Priority Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">Priority:</span>
        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[130px]"
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">Category:</span>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[130px]"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Assigned To Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">Assigned:</span>
        <select
          value={filters.assignedTo}
          onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[130px]"
        >
          <option value="all">All Members</option>
          {teamMembers.map(member => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>

      {/* Client Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">Client:</span>
        <select
          value={filters.client}
          onChange={(e) => handleFilterChange('client', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm w-full sm:min-w-[130px]"
        >
          <option value="all">All Clients</option>
          {uniqueClients.map(client => (
            <option key={client} value={client}>{client}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex items-end">
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <FaFilter />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
