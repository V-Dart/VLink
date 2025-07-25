import Sidebar from "../../components/po/Sidebar";

export default function POLogout() {

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Fixed sidebar with slide menu */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-4 sm:py-6 ml-[60px]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-8 mt-8 sm:mt-12 md:mt-0 text-center">
          Product Owner - Logout
        </h1>
        <div className="bg-[#1e293b] rounded-lg shadow-lg p-6 sm:p-8 flex flex-col items-center border border-gray-700 w-full max-w-md">
          <p className="text-gray-200 text-base sm:text-lg mb-6 sm:mb-8 text-center">Are you sure you want to logout?</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
            <button
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            >
              Logout
            </button>
            <button
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 