import { FaFilter } from "react-icons/fa";
import { MdBusiness, MdDesignServices } from "react-icons/md";

const filterOptions = [
  { value: "all", label: "All Clients", icon: null },
  { value: "Product-based", label: "Product-based", icon: <MdBusiness /> },
  { value: "Service-based", label: "Service-based", icon: <MdDesignServices /> }
];

export default function FilterToggle({ selectedFilter, onFilterChange }) {
  return (
    <div className="flex items-center gap-2">
      <FaFilter className="text-gray-400" />
      <div className="flex bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
              selectedFilter === option.value
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {option.icon && <span className="text-lg">{option.icon}</span>}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
