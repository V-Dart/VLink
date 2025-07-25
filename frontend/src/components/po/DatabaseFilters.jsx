import { FaFilter, FaDatabase, FaExclamationTriangle } from "react-icons/fa";
import { SiMongodb, SiPostgresql, SiFirebase, SiMysql } from "react-icons/si";
import { MdBusiness, MdDesignServices } from "react-icons/md";

const dbTypeOptions = [
  { value: "all", label: "All Databases", icon: <FaDatabase /> },
  { value: "MongoDB", label: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
  { value: "PostgreSQL", label: "PostgreSQL", icon: <SiPostgresql className="text-blue-500" /> },
  { value: "Firebase", label: "Firebase", icon: <SiFirebase className="text-orange-500" /> },
  { value: "MySQL", label: "MySQL", icon: <SiMysql className="text-blue-600" /> }
];

const clientTypeOptions = [
  { value: "all", label: "All Types", icon: null },
  { value: "Product-based", label: "Product", icon: <MdBusiness /> },
  { value: "Service-based", label: "Service", icon: <MdDesignServices /> }
];

const storageLevelOptions = [
  { value: "all", label: "All Levels", icon: null },
  { value: "critical", label: "Critical", icon: <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div> },
  { value: "warning", label: "Warning", icon: <FaExclamationTriangle className="text-yellow-400" /> },
  { value: "healthy", label: "Healthy", icon: <div className="w-3 h-3 bg-green-500 rounded-full"></div> }
];

export default function DatabaseFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Database Type Filter */}
      <div className="flex items-center gap-2">
        <FaDatabase className="text-gray-400" />
        <select
          value={filters.dbType}
          onChange={(e) => handleFilterChange('dbType', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-w-[140px]"
        >
          {dbTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Client Type Filter */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Type:</span>
        <select
          value={filters.clientType}
          onChange={(e) => handleFilterChange('clientType', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-w-[120px]"
        >
          {clientTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Storage Level Filter */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Storage:</span>
        <select
          value={filters.storageLevel}
          onChange={(e) => handleFilterChange('storageLevel', e.target.value)}
          className="bg-[#1e293b] border border-gray-700 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-w-[120px]"
        >
          {storageLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {(filters.dbType !== "all" || filters.clientType !== "all" || filters.storageLevel !== "all") && (
        <button
          onClick={() => onFiltersChange({ dbType: "all", clientType: "all", storageLevel: "all" })}
          className="px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors text-sm"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
