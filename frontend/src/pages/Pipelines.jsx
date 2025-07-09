import React, { useState } from "react";
import { FiPlus, FiSearch, FiUsers, FiBarChart2, FiEdit, FiTrash2, FiChevronRight, FiChevronLeft, FiActivity } from "react-icons/fi";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";

const pipelineStages = [
  "Lead",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost"
];
const stageColors = {
  "Lead": "bg-blue-900/30 text-blue-300",
  "Contacted": "bg-purple-900/30 text-purple-300",
  "Qualified": "bg-yellow-900/30 text-yellow-300",
  "Proposal": "bg-pink-900/30 text-pink-300",
  "Won": "bg-green-900/30 text-green-300",
  "Lost": "bg-red-900/30 text-red-300"
};
const mockTeams = [
  { id: 1, name: "Alpha Team" },
  { id: 2, name: "Beta Team" },
  { id: 3, name: "Gamma Team" },
];
const mockDealsByTeam = {
  1: [
    { id: 1, name: "ACME Corp", value: 12000, stage: "Lead", owner: "John Doe", company: "ACME Corp", status: "Active", activity: ["Created deal", "Contacted client"] },
    { id: 2, name: "Beta Ltd", value: 8000, stage: "Contacted", owner: "Jane Smith", company: "Beta Ltd", status: "Active", activity: ["Created deal"] },
    { id: 3, name: "Gamma Inc", value: 15000, stage: "Qualified", owner: "Mike Johnson", company: "Gamma Inc", status: "Active", activity: ["Created deal", "Qualified lead"] },
    { id: 4, name: "Delta LLC", value: 20000, stage: "Proposal", owner: "Sarah Wilson", company: "Delta LLC", status: "Active", activity: ["Created deal", "Proposal sent"] },
    { id: 5, name: "Epsilon GmbH", value: 5000, stage: "Lost", owner: "Anna Lee", company: "Epsilon GmbH", status: "Lost", activity: ["Created deal", "Lost deal"] },
    { id: 6, name: "Zeta SA", value: 25000, stage: "Won", owner: "Chris Kim", company: "Zeta SA", status: "Won", activity: ["Created deal", "Won deal"] },
  ],
  2: [
    { id: 1, name: "Beta: New Client", value: 9000, stage: "Lead", owner: "Alice", company: "Beta Co", status: "Active", activity: ["Created deal"] },
  ],
  3: [
    { id: 1, name: "Gamma: Big Deal", value: 30000, stage: "Qualified", owner: "Bob", company: "Gamma Group", status: "Active", activity: ["Created deal"] },
  ],
};

function DealModal({ open, onClose, onSave, initial, stages }) {
  const [name, setName] = useState(initial?.name || "");
  const [company, setCompany] = useState(initial?.company || "");
  const [owner, setOwner] = useState(initial?.owner || "");
  const [value, setValue] = useState(initial?.value || "");
  const [stage, setStage] = useState(initial?.stage || stages[0]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiChevronRight className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold text-white mb-6">{initial ? "Edit Deal" : "Add Deal"}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ name, company, owner, value: Number(value), stage }); }} className="flex flex-col gap-4">
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Deal Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} required />
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Owner" value={owner} onChange={e => setOwner(e.target.value)} required />
          <input type="number" className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Value" value={value} onChange={e => setValue(e.target.value)} required min={0} />
          <select className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" value={stage} onChange={e => setStage(e.target.value)}>
            {stages.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium mt-2">{initial ? "Save Changes" : "Add Deal"}</button>
        </form>
      </div>
    </div>
  );
}

export default function Pipelines() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [teams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const [dealsByTeam, setDealsByTeam] = useState(mockDealsByTeam);
  const deals = dealsByTeam[selectedTeam] || [];
  const [search, setSearch] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [deleteDealId, setDeleteDealId] = useState(null);

  const handleHamburgerHover = () => { if (!isPermanent) setMenuOpen(true); };
  const handleHamburgerLeave = () => { if (!isPermanent && !isHoveringMenu) setMenuOpen(false); };
  const handleHamburgerClick = () => { setPermanent((prev) => !prev); setMenuOpen((prev) => (!isPermanent ? true : false)); };
  const handleMenuHover = () => { setIsHoveringMenu(true); if (!isPermanent) setMenuOpen(true); };
  const handleMenuLeave = () => { setIsHoveringMenu(false); if (!isPermanent) setMenuOpen(false); };

  // Filter deals by search
  const filteredDeals = deals.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.company.toLowerCase().includes(search.toLowerCase()));

  // Add/Edit Deal
  const handleSaveDeal = (data) => {
    setDealsByTeam(prev => {
      const teamDeals = prev[selectedTeam] || [];
      if (editDeal) {
        return {
          ...prev,
          [selectedTeam]: teamDeals.map(d => d.id === editDeal.id ? { ...d, ...data } : d)
        };
      } else {
        return {
          ...prev,
          [selectedTeam]: [
            ...teamDeals,
            { ...data, id: Math.max(0, ...teamDeals.map(d => d.id)) + 1, status: "Active", activity: ["Created deal"] }
          ]
        };
      }
    });
    setShowDealModal(false);
    setEditDeal(null);
  };
  // Delete Deal
  const handleDeleteDeal = (id) => {
    setDealsByTeam(prev => ({
      ...prev,
      [selectedTeam]: (prev[selectedTeam] || []).filter(d => d.id !== id)
    }));
    setDeleteDealId(null);
    setSelectedDeal(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      <Sidebar
        toggleSlideMenu={handleHamburgerClick}
        onHamburgerHover={handleHamburgerHover}
        onHamburgerLeave={handleHamburgerLeave}
        isPermanent={isPermanent}
      />
      {isMenuOpen && <div className="fixed top-0 left-16 h-full z-10"></div>}
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => { if (!isPermanent) setMenuOpen(false); }}
        onMenuHover={handleMenuHover}
        onMenuLeave={handleMenuLeave}
      />
      <main className={`flex-1 flex flex-col px-4 py-10 transition-all duration-300 ${isMenuOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}>
        <h1 className="text-3xl font-bold text-white mb-4 mt-4 text-center flex items-center gap-2">
          <FiBarChart2 className="w-8 h-8 text-blue-400" /> Sales Pipelines
        </h1>
        {/* Team Selector below header */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-6 py-3 flex items-center gap-3 shadow">
            <span className="text-white font-medium text-base">Team:</span>
            <select
              className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-6 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-semibold shadow-md hover:border-blue-400 hover:from-blue-800 hover:to-blue-600 cursor-pointer"
              value={selectedTeam}
              onChange={e => { setSelectedTeam(Number(e.target.value)); setEditDeal(null); setShowDealModal(false); setSelectedDeal(null); }}
            >
              {teams.map(team => (
                <option key={team.id} value={team.id} className="bg-[#1e293b] text-white">{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Pipeline Board & Analytics */}
        <div className="w-full flex flex-col lg:flex-row gap-8">
          {/* Pipeline Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pipelineStages.map(stage => (
                <div key={stage} className={`rounded-xl shadow-lg border border-[#334155] flex flex-col ${stageColors[stage]}`}> 
                  <div className="p-4 border-b border-[#334155] flex items-center justify-between">
                    <span className="font-semibold text-lg">{stage}</span>
                    <span className="bg-white/10 text-xs font-bold px-2 py-1 rounded-full">{filteredDeals.filter(d => d.stage === stage).length}</span>
                  </div>
                  <div className="flex-1 p-2 space-y-3">
                    {filteredDeals.filter(d => d.stage === stage).length === 0 && (
                      <div className="text-white/60 text-xs text-center py-4">No deals</div>
                    )}
                    {filteredDeals.filter(d => d.stage === stage).map(deal => (
                      <div key={deal.id} className="bg-[#273549] rounded-lg p-3 shadow flex flex-col gap-1 cursor-pointer hover:bg-blue-900/40 transition-all border border-[#334155] relative group" onClick={() => setSelectedDeal(deal)}>
                        <span className="text-white font-medium truncate">{deal.name}</span>
                        <span className="text-xs text-gray-400">{deal.company}</span>
                        <span className="text-xs text-blue-300 font-bold">${deal.value.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">Owner: {deal.owner}</span>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-all">
                          <button onClick={e => { e.stopPropagation(); setEditDeal(deal); setShowDealModal(true); }} className="p-1 text-yellow-400 hover:bg-yellow-900/30 rounded transition-colors" title="Edit"><FiEdit className="w-4 h-4" /></button>
                          <button onClick={e => { e.stopPropagation(); setDeleteDealId(deal.id); }} className="p-1 text-red-400 hover:bg-red-900/30 rounded transition-colors" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="w-full h-1 bg-blue-900/30 rounded mt-2">
                          <div className={`h-1 rounded ${stage === "Won" ? "bg-green-400" : stage === "Lost" ? "bg-red-400" : "bg-blue-400"}`} style={{ width: `${((pipelineStages.indexOf(stage)+1)/pipelineStages.length)*100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-[#334155] flex justify-center">
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium" onClick={() => { setEditDeal(null); setShowDealModal(true); }}>
                      <FiPlus className="w-4 h-4" /> Add Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Search & Analytics */}
          <div className="w-full lg:w-80 flex flex-col gap-6 mt-8 lg:mt-0">
            <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-4 sticky top-8 z-20">
              <div className="flex items-center gap-2 mb-2">
                <FiSearch className="w-5 h-5 text-blue-400" />
                <input
                  className="bg-transparent border-none outline-none text-white flex-1 px-2 py-1"
                  placeholder="Search deals or company..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-4 flex flex-col gap-2">
              <span className="text-white font-semibold text-lg mb-2 flex items-center gap-2"><FiUsers className="w-5 h-5 text-blue-400" /> Pipeline Summary</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Total Deals: <span className="text-white font-bold">{filteredDeals.length}</span></span>
                <span className="text-xs text-gray-400">Total Value: <span className="text-white font-bold">${filteredDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</span></span>
                <span className="text-xs text-gray-400">Won: <span className="text-green-400 font-bold">{filteredDeals.filter(d => d.stage === "Won").length}</span></span>
                <span className="text-xs text-gray-400">Lost: <span className="text-red-400 font-bold">{filteredDeals.filter(d => d.stage === "Lost").length}</span></span>
              </div>
            </div>
          </div>
        </div>
        {/* Deal Details Modal */}
        {selectedDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155] relative">
              <button onClick={() => setSelectedDeal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiChevronRight className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-white mb-6">Deal Details</h2>
              <div className="flex flex-col gap-2">
                <span className="text-white font-semibold text-lg">{selectedDeal.name}</span>
                <span className="text-xs text-gray-400">Company: {selectedDeal.company}</span>
                <span className="text-xs text-gray-400">Owner: {selectedDeal.owner}</span>
                <span className="text-xs text-gray-400">Stage: {selectedDeal.stage}</span>
                <span className="text-xs text-gray-400">Value: <span className="text-blue-300 font-bold">${selectedDeal.value.toLocaleString()}</span></span>
                <span className="text-xs text-gray-400">Status: {selectedDeal.status}</span>
                <div className="mt-4">
                  <span className="text-xs text-white/70 font-semibold flex items-center gap-1 mb-2"><FiActivity /> Activity Log</span>
                  <ul className="pl-4 list-disc text-xs text-white/60">
                    {selectedDeal.activity?.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2" onClick={() => { setEditDeal(selectedDeal); setShowDealModal(true); }}><FiEdit className="w-4 h-4" /> Edit</button>
                <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center gap-2" onClick={() => setDeleteDealId(selectedDeal.id)}><FiTrash2 className="w-4 h-4" /> Delete</button>
              </div>
            </div>
          </div>
        )}
        {/* Add/Edit Deal Modal */}
        <DealModal open={showDealModal} onClose={() => { setShowDealModal(false); setEditDeal(null); }} onSave={handleSaveDeal} initial={editDeal} stages={pipelineStages} />
        {/* Delete Deal Confirmation */}
        {deleteDealId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-sm border border-[#334155] relative flex flex-col items-center">
              <h2 className="text-xl font-bold text-white mb-4">Delete Deal?</h2>
              <p className="text-white/70 mb-6">Are you sure you want to delete this deal? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium" onClick={() => setDeleteDealId(null)}>Cancel</button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium" onClick={() => handleDeleteDeal(deleteDealId)}>Delete</button>
              </div>
            </div>
          </div>
        )}
        {/* Floating Add Deal Button */}
        <button className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 text-lg font-bold" onClick={() => { setEditDeal(null); setShowDealModal(true); }}>
          <FiPlus className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
}
