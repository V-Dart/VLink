import Sidebar from "../../components/po/Sidebar";

export default function POIssues() {

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Fixed sidebar with slide menu */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 ml-[60px]">
        <h1 className="text-2xl font-semibold text-white mb-8 mt-12 md:mt-0 text-center">
          Product Owner - Issue Tracker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Open Issues Card */}
          <div className="bg-[#1e293b] rounded-lg shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-gray-700">
            <span className="text-lg font-bold text-white mb-2">Open Issues</span>
            <span className="text-4xl font-extrabold text-blue-400 mb-1">12</span>
            <span className="text-gray-400 text-center">Dummy count of open issues.</span>
          </div>
          {/* Resolved Issues Card */}
          <div className="bg-[#1e293b] rounded-lg shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-gray-700">
            <span className="text-lg font-bold text-white mb-2">Resolved Issues</span>
            <span className="text-4xl font-extrabold text-green-400 mb-1">34</span>
            <span className="text-gray-400 text-center">Dummy count of resolved issues.</span>
          </div>
        </div>
      </main>
    </div>
  );
} 