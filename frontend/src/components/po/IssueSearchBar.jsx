import { FaSearch, FaTimes } from "react-icons/fa";

export default function IssueSearchBar({ searchTerm, onSearchChange }) {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400 text-sm sm:text-base" />
      </div>
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search issues by title, client, or description..."
        className="w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2 sm:py-3 bg-[#1e293b] border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
      />
      
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes className="text-sm sm:text-base" />
        </button>
      )}
    </div>
  );
}
