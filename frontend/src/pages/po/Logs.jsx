import Sidebar from "../../components/po/Sidebar";

export default function POLogs() {

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Fixed sidebar with slide menu */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 ml-[60px]">
        <h1 className="text-2xl font-semibold text-white mb-8 mt-12 md:mt-0 text-center">
          Product Owner - Logs
        </h1>

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-[#1e293b] rounded-lg shadow-lg border border-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">Triggered By</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-[#334155]/80 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">2024-05-01 10:23:45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">Database Backup Completed</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">System</td>
              </tr>
              <tr className="hover:bg-[#334155]/80 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">2024-05-01 09:58:12</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">User Added</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">Admin</td>
              </tr>
              <tr className="hover:bg-[#334155]/80 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">2024-04-30 17:42:01</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">Schema Updated</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">ProductOwner</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 