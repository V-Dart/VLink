import Sidebar from "../../components/po/Sidebar";

export default function POManageDB() {

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Fixed sidebar with slide menu */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 ml-[60px]">
        <h1 className="text-2xl font-semibold text-white mb-8 mt-12 md:mt-0 text-center">
          Product Owner - Manage Database
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* User Table Card */}
          <div className="bg-[#1e293b] rounded-lg shadow-lg p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-gray-700">
            <span className="text-lg font-bold text-white mb-2">User Table</span>
            <span className="text-gray-400 text-center">Placeholder for user table management.</span>
          </div>
          {/* Transaction Logs Card */}
          <div className="bg-[#1e293b] rounded-lg shadow-lg p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-gray-700">
            <span className="text-lg font-bold text-white mb-2">Transaction Logs</span>
            <span className="text-gray-400 text-center">Placeholder for transaction logs.</span>
          </div>
          {/* Product Schema Overview Card */}
          <div className="bg-[#1e293b] rounded-lg shadow-lg p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-gray-700">
            <span className="text-lg font-bold text-white mb-2">Product Schema Overview</span>
            <span className="text-gray-400 text-center">Placeholder for product schema overview.</span>
          </div>
        </div>
      </main>
    </div>
  );
} 