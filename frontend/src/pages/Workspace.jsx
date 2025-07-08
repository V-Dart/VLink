import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import { FiUsers, FiUserPlus, FiClipboard, FiFileText, FiActivity, FiChevronRight, FiEdit, FiTrash2, FiX, FiChevronDown } from "react-icons/fi";

const mockTeams = [
  { id: 1, name: "Alpha Team" },
  { id: 2, name: "Beta Team" },
  { id: 3, name: "Gamma Team" },
];
const mockTeamMembers = {
  1: [
    { id: 1, name: "John Doe", role: "Sales Manager" },
    { id: 2, name: "Jane Smith", role: "Account Executive" },
    { id: 3, name: "Mike Johnson", role: "Customer Success" },
    { id: 4, name: "Sarah Wilson", role: "Support Lead" },
  ],
  2: [
    { id: 1, name: "Alice Brown", role: "Team Lead" },
    { id: 2, name: "Bob White", role: "Analyst" },
  ],
  3: [
    { id: 1, name: "Charlie Green", role: "Manager" },
  ],
};
const mockActivityByTeam = {
  1: [
    { id: 1, type: "note", text: "Added note to ACME Corp deal.", time: "2h ago" },
    { id: 2, type: "upload", text: "Uploaded contract for Beta Ltd.", time: "5h ago" },
    { id: 3, type: "update", text: "Moved Gamma Inc to Qualified stage.", time: "1d ago" },
  ],
  2: [
    { id: 1, type: "note", text: "Beta: Added new lead.", time: "3h ago" },
  ],
  3: [
    { id: 1, type: "update", text: "Gamma: Updated dashboard.", time: "4h ago" },
  ],
};

// Mock tickets assigned to members (by member name for simplicity)
const mockTicketsByMember = {
  "John Doe": [
    { id: 1, title: "Follow up with supplier", status: "Assigned" },
    { id: 2, title: "Send invoice to ACME Corp", status: "Pending" },
  ],
  "Jane Smith": [
    { id: 3, title: "Schedule delivery for Order #1234", status: "Assigned" },
  ],
  "Mike Johnson": [],
  "Sarah Wilson": [
    { id: 4, title: "Review contract terms", status: "Assigned" },
  ],
  "Alice Brown": [
    { id: 5, title: "Beta: Prepare Q3 report", status: "Pending" },
  ],
  "Bob White": [],
  "Charlie Green": [
    { id: 6, title: "Gamma: Update CRM", status: "Assigned" },
  ],
};

const statusColors = {
  "Assigned": "bg-yellow-500 text-white",
  "Pending": "bg-gray-400 text-white",
};

export default function Workspace() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [teams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const [teamMembersByTeam, setTeamMembersByTeam] = useState({ ...mockTeamMembers });
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [moveMemberId, setMoveMemberId] = useState(null);
  const [moveToTeam, setMoveToTeam] = useState(teams[0].id);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const teamMembers = teamMembersByTeam[selectedTeam] || [];
  const mockActivity = mockActivityByTeam[selectedTeam] || [];

  const handleHamburgerHover = () => {
    if (!isPermanent) setMenuOpen(true);
  };
  const handleHamburgerLeave = () => {
    if (!isPermanent && !isHoveringMenu) setMenuOpen(false);
  };
  const handleHamburgerClick = () => {
    setPermanent((prev) => !prev);
    setMenuOpen((prev) => (!isPermanent ? true : false));
  };
  const handleMenuHover = () => {
    setIsHoveringMenu(true);
    if (!isPermanent) setMenuOpen(true);
  };
  const handleMenuLeave = () => {
    setIsHoveringMenu(false);
    if (!isPermanent) setMenuOpen(false);
  };

  // Add member handler
  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberRole.trim()) return;
    setTeamMembersByTeam(prev => {
      const newId = Math.max(0, ...(prev[selectedTeam]?.map(m => m.id) || [0])) + 1;
      return {
        ...prev,
        [selectedTeam]: [
          ...(prev[selectedTeam] || []),
          { id: newId, name: newMemberName, role: newMemberRole },
        ],
      };
    });
    setShowAddMemberModal(false);
    setNewMemberName("");
    setNewMemberRole("");
  };

  // Delete member handler
  const handleDeleteMember = () => {
    setTeamMembersByTeam(prev => ({
      ...prev,
      [selectedTeam]: prev[selectedTeam].filter(m => m.id !== deleteMemberId),
    }));
    setShowDeleteModal(false);
    setDeleteMemberId(null);
  };

  // Move member handler
  const handleMoveMember = (member, toTeamId) => {
    if (toTeamId === selectedTeam) return;
    setTeamMembersByTeam(prev => {
      // Remove from current team
      const updatedCurrent = prev[selectedTeam].filter(m => m.id !== member.id);
      // Add to new team (new id for that team)
      const newId = Math.max(0, ...(prev[toTeamId]?.map(m => m.id) || [0])) + 1;
      const updatedTarget = [ ...(prev[toTeamId] || []), { ...member, id: newId } ];
      return {
        ...prev,
        [selectedTeam]: updatedCurrent,
        [toTeamId]: updatedTarget,
      };
    });
    setMoveMemberId(null);
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
        onClose={() => {
          if (!isPermanent) setMenuOpen(false);
        }}
        onMenuHover={handleMenuHover}
        onMenuLeave={handleMenuLeave}
      />
      <main className={`flex-1 flex flex-col px-4 py-10 transition-all duration-300 ${isMenuOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}>
        <h1 className="text-3xl font-bold text-white mb-4 mt-4 text-center flex items-center gap-2">
          <FiClipboard className="w-8 h-8 text-blue-400" /> Workspace
        </h1>
        {/* Team Selector below Workspace header */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-6 py-3 flex items-center gap-3 shadow">
            <span className="text-white font-medium text-base">Team:</span>
            <select
              className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-6 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-semibold shadow-md hover:border-blue-400 hover:from-blue-800 hover:to-blue-600 cursor-pointer"
              value={selectedTeam}
              onChange={e => setSelectedTeam(Number(e.target.value))}
            >
              {teams.map(team => (
                <option key={team.id} value={team.id} className="bg-[#1e293b] text-white">{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
          {/* Team Members */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold text-lg flex items-center gap-2"><FiUsers className="w-5 h-5 text-blue-400" /> Team</span>
              <button className="text-blue-400 hover:text-blue-300 text-xs font-medium" onClick={() => setShowTeam(true)}>Modify</button>
            </div>
            <ul className="space-y-2">
              {teamMembers.slice(0, 3).map(m => (
                <li key={m.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-white font-bold text-lg">{m.name[0]}</div>
                  <div>
                    <span className="text-white font-medium">{m.name}</span>
                    <span className="block text-xs text-gray-400">{m.role}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium" onClick={() => setShowAddMemberModal(true)}><FiUserPlus className="w-4 h-4" /> Add Member</button>
          </div>
          {/* Quick Actions */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-6 flex flex-col gap-4">
            <span className="text-white font-semibold text-lg mb-2 flex items-center gap-2"><FiFileText className="w-5 h-5 text-blue-400" /> Quick Actions</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"><FiClipboard className="w-4 h-4" /> Add Note</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"><FiFileText className="w-4 h-4" /> Upload Document</button>
          </div>
          {/* Recent Activity */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold text-lg flex items-center gap-2"><FiActivity className="w-5 h-5 text-blue-400" /> Recent Activity</span>
              <button className="text-blue-400 hover:text-blue-300 text-xs font-medium" onClick={() => setShowActivity(true)}>View All</button>
            </div>
            <ul className="space-y-2">
              {mockActivity.slice(0, 3).map(a => (
                <li key={a.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-white font-bold text-lg">
                    {a.type === "note" ? <FiClipboard /> : a.type === "upload" ? <FiFileText /> : <FiActivity />}
                  </div>
                  <div>
                    <span className="text-white font-medium">{a.text}</span>
                    <span className="block text-xs text-gray-400">{a.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Dashboard Summary */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] p-8 flex flex-col items-center mb-8">
          <span className="text-white font-semibold text-lg mb-2">Workspace Dashboard</span>
          <div className="w-full h-40 bg-[#273549] rounded-lg flex items-center justify-center text-gray-400 text-xl">
            [Workspace Summary & Charts Placeholder]
          </div>
        </div>
        {/* Team Modal */}
        {showTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2 sm:px-0">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-lg border border-[#334155] relative mx-auto max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowTeam(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiChevronRight className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-white mb-6">Team Members</h2>
              <ul className="space-y-3">
                {teamMembers.map(m => (
                  <li key={m.id} className="flex flex-col gap-1 bg-[#22304a] rounded-lg p-4 border border-[#334155]">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-white font-bold text-lg">{m.name[0]}</div>
                        <div>
                          <span className="text-white font-medium">{m.name}</span>
                          <span className="block text-xs text-gray-400">{m.role}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Member" onClick={() => { setDeleteMemberId(m.id); setShowDeleteModal(true); }}><FiTrash2 className="w-5 h-5" /></button>
                        <div className="relative">
                          <button className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-1" title="Move Member" onClick={() => setMoveMemberId(m.id)}>
                            <FiChevronDown className="w-4 h-4" />
                          </button>
                          {moveMemberId === m.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-[#273549] border border-[#334155] rounded-lg shadow-lg z-50 animate-fade-in">
                              <div className="px-3 py-2 text-xs text-white">Move to team:</div>
                              {teams.filter(t => t.id !== selectedTeam).map(t => (
                                <button key={t.id} className="w-full text-left px-4 py-2 text-white hover:bg-[#334155] transition-colors" onClick={() => handleMoveMember(m, t.id)}>{t.name}</button>
                              ))}
                              <button className="w-full text-left px-4 py-2 text-gray-400 hover:bg-[#334155] transition-colors" onClick={() => setMoveMemberId(null)}>Cancel</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Assigned tickets for this member */}
                    {mockTicketsByMember[m.name] && mockTicketsByMember[m.name].some(ticket => ticket.status === 'Assigned') && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-400 mb-1">Assigned Tickets:</div>
                        <ul className="space-y-1">
                          {mockTicketsByMember[m.name].filter(ticket => ticket.status === 'Assigned').map(ticket => (
                            <li key={ticket.id} className="flex items-center gap-2">
                              <span className="text-white text-sm">{ticket.title}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}>{ticket.status}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <button className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-base" style={{width: 'fit-content'}} onClick={() => setShowAddMemberModal(true)}>
                <FiUserPlus className="w-5 h-5" /> Add Member
              </button>
            </div>
          </div>
        )}
        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-xs border border-[#334155]">
              <h2 className="text-lg font-bold text-white mb-4">Add Team Member</h2>
              <input className="w-full px-4 py-2 rounded-lg bg-[#273549] text-white border border-[#334155] mb-3" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Name" />
              <input className="w-full px-4 py-2 rounded-lg bg-[#273549] text-white border border-[#334155] mb-4" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} placeholder="Role" />
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium" onClick={handleAddMember}>Add</button>
                <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium" onClick={() => setShowAddMemberModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Member Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-xs border border-[#334155]">
              <h2 className="text-lg font-bold text-white mb-4">Remove Member</h2>
              <p className="text-white mb-4">Are you sure you want to remove this member from the team?</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium" onClick={handleDeleteMember}>Remove</button>
                <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {/* Activity Modal */}
        {showActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155] relative">
              <button onClick={() => setShowActivity(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiChevronRight className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              <ul className="space-y-3">
                {mockActivity.map(a => (
                  <li key={a.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-white font-bold text-lg">
                      {a.type === "note" ? <FiClipboard /> : a.type === "upload" ? <FiFileText /> : <FiActivity />}
                    </div>
                    <div>
                      <span className="text-white font-medium">{a.text}</span>
                      <span className="block text-xs text-gray-400">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
