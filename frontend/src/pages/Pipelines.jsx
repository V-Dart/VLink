import React, { useState } from "react";
import { FiPlus, FiSearch, FiUsers, FiBarChart2, FiEdit, FiTrash2, FiChevronRight, FiChevronLeft, FiActivity, FiClipboard, FiX, FiCheckCircle, FiClock, FiAlertCircle, FiCheckSquare } from "react-icons/fi";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";

const mockTeams = [
  { id: 1, name: "Alpha Team" },
  { id: 2, name: "Beta Team" },
  { id: 3, name: "Gamma Team" },
];

const mockTicketsByTeam = {
  1: [
    { id: 1, title: "Bug fix in login module", status: "Open", priority: "High", assigned: "John Doe", due: "2024-06-10", description: "Critical authentication issue", activity: ["Created ticket", "Assigned to John"] },
    { id: 7, title: "Email notification system", status: "Open", priority: "Medium", assigned: "Alex Chen", due: "2024-06-14", description: "Implement email alerts for user actions", activity: ["Created ticket", "Requirements gathered"] },
    { id: 8, title: "Payment gateway integration", status: "Open", priority: "High", assigned: "Maria Garcia", due: "2024-06-16", description: "Integrate Stripe payment processing", activity: ["Created ticket", "API keys configured"] },
    { id: 9, title: "User profile customization", status: "Open", priority: "Low", assigned: "David Wilson", due: "2024-06-22", description: "Allow users to customize their profile settings", activity: ["Created ticket", "Design approved"] },
    { id: 2, title: "Update user dashboard", status: "In Progress", priority: "Medium", assigned: "Jane Smith", due: "2024-06-15", description: "Add new analytics widgets", activity: ["Created ticket", "Started development"] },
    { id: 3, title: "Database optimization", status: "Review", priority: "Low", assigned: "Mike Johnson", due: "2024-06-20", description: "Performance improvements", activity: ["Created ticket", "Code review pending"] },
    { id: 4, title: "API documentation update", status: "Testing", priority: "Medium", assigned: "Sarah Wilson", due: "2024-06-12", description: "Update REST API docs", activity: ["Created ticket", "In testing phase"] },
    { id: 5, title: "Security audit", status: "Closed", priority: "High", assigned: "Anna Lee", due: "2024-06-08", description: "Annual security review", activity: ["Created ticket", "Completed audit"] },
    { id: 6, title: "Mobile app update", status: "Closed", priority: "Medium", assigned: "Chris Kim", due: "2024-06-05", description: "iOS compatibility fixes", activity: ["Created ticket", "Deployed to App Store"] },
  ],
  2: [
    { id: 1, title: "UI redesign", status: "Open", priority: "High", assigned: "Alice", due: "2024-06-18", description: "Complete interface overhaul", activity: ["Created ticket"] },
    { id: 2, title: "Performance testing", status: "In Progress", priority: "Medium", assigned: "Bob", due: "2024-06-25", description: "Load testing for new features", activity: ["Created ticket", "Test setup complete"] },
  ],
  3: [
    { id: 1, title: "Cloud migration", status: "Review", priority: "High", assigned: "Charlie", due: "2024-06-30", description: "Migrate to AWS infrastructure", activity: ["Created ticket", "Architecture review"] },
    { id: 2, title: "Monitoring setup", status: "Testing", priority: "Low", assigned: "Diana", due: "2024-07-05", description: "Implement monitoring tools", activity: ["Created ticket", "Tool configuration"] },
  ],
};

const ticketStatuses = [
  "Open",
  "In Progress", 
  "Review",
  "Testing",
  "Closed"
];

const statusColors = {
  "Open": "bg-red-500 text-white",
  "In Progress": "bg-blue-500 text-white", 
  "Review": "bg-yellow-500 text-white",
  "Testing": "bg-purple-500 text-white",
  "Closed": "bg-green-500 text-white"
};

const priorityColors = {
  "High": "text-red-400",
  "Medium": "text-yellow-400", 
  "Low": "text-green-400"
};

const priorityIcons = {
  "High": <FiAlertCircle className="w-4 h-4" />,
  "Medium": <FiClock className="w-4 h-4" />,
  "Low": <FiCheckSquare className="w-4 h-4" />
};

function TicketModal({ open, onClose, onSave, initial, statuses }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [assigned, setAssigned] = useState(initial?.assigned || "");
  const [due, setDue] = useState(initial?.due || "");
  const [status, setStatus] = useState(initial?.status || statuses[0]);
  const [priority, setPriority] = useState(initial?.priority || "Medium");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-[#1e293b] rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-md border border-[#334155] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiX className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold text-white mb-6">{initial ? "Edit Ticket" : "Add Ticket"}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ title, description, assigned, due, status, priority }); }} className="flex flex-col gap-4">
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Ticket Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Assigned To" value={assigned} onChange={e => setAssigned(e.target.value)} required />
          <input type="date" className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" value={due} onChange={e => setDue(e.target.value)} required />
          <select className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" value={status} onChange={e => setStatus(e.target.value)}>
            {statuses.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium mt-2">{initial ? "Save Changes" : "Add Ticket"}</button>
        </form>
      </div>
    </div>
  );
}

export default function TicketTracker() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [teams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [ticketsByTeam, setTicketsByTeam] = useState(mockTicketsByTeam);
  // Get tickets based on selection - show all teams or specific team
  const tickets = selectedTeam === 'all' 
    ? Object.values(ticketsByTeam).flat() 
    : ticketsByTeam[selectedTeam] || [];
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [deleteTicketId, setDeleteTicketId] = useState(null);

  const handleHamburgerHover = () => { if (!isPermanent) setMenuOpen(true); };
  const handleHamburgerLeave = () => { if (!isPermanent && !isHoveringMenu) setMenuOpen(false); };
  const handleHamburgerClick = () => { setPermanent((prev) => !prev); setMenuOpen((prev) => (!isPermanent ? true : false)); };
  const handleMenuHover = () => { setIsHoveringMenu(true); if (!isPermanent) setMenuOpen(true); };
  const handleMenuLeave = () => { setIsHoveringMenu(false); if (!isPermanent) setMenuOpen(false); };

  // Filter tickets by search
  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.priority.toLowerCase().includes(search.toLowerCase())
  );

  // Add/Edit Ticket
  const handleSaveTicket = (data) => {
    setTicketsByTeam(prev => {
      // If showing all teams, default to first team for new tickets
      const targetTeam = selectedTeam === 'all' ? teams[0].id : selectedTeam;
      const teamTickets = prev[targetTeam] || [];
      
      if (editTicket) {
        // For editing, find the ticket across all teams
        const updated = { ...prev };
        Object.keys(updated).forEach(teamId => {
          updated[teamId] = updated[teamId].map(t => 
            t.id === editTicket.id ? { ...t, ...data } : t
          );
        });
        return updated;
      } else {
        // For new tickets, add to the target team
        return {
          ...prev,
          [targetTeam]: [
            ...teamTickets,
            { ...data, id: Math.max(0, ...teamTickets.map(t => t.id)) + 1, activity: ["Created ticket"] }
          ]
        };
      }
    });
    setShowTicketModal(false);
    setEditTicket(null);
  };

  // Delete Ticket
  const handleDeleteTicket = (id) => {
    setTicketsByTeam(prev => {
      const updated = { ...prev };
      // Delete from all teams (in case we're showing all teams)
      Object.keys(updated).forEach(teamId => {
        updated[teamId] = updated[teamId].filter(t => t.id !== id);
      });
      return updated;
    });
    setDeleteTicketId(null);
    setSelectedTicket(null);
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
          <FiClipboard className="w-8 h-8 text-blue-400" /> Ticket Status Tracker
        </h1>
        
        {/* Team Selector and Search Bar */}
        <div className="flex justify-center mb-6 sm:mb-8 px-4">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow w-full max-w-2xl">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-white font-medium text-sm sm:text-base">Team:</span>
              <select
                className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-xs sm:text-sm font-semibold shadow-md hover:border-blue-400 hover:from-blue-800 hover:to-blue-600 cursor-pointer flex-1 sm:flex-none"
                value={selectedTeam}
                onChange={e => { setSelectedTeam(e.target.value === 'all' ? 'all' : Number(e.target.value)); setEditTicket(null); setShowTicketModal(false); setSelectedTicket(null); }}
              >
                <option value="all" className="bg-[#1e293b] text-white">Show All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id} className="bg-[#1e293b] text-white">{team.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 border-l border-[#334155] pl-6 w-full sm:w-auto">
              <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
              <input
                className="bg-transparent border-none outline-none text-white flex-1 px-2 py-1 text-sm sm:text-base placeholder-gray-400"
                placeholder="Search tickets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Ticket Board */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {ticketStatuses.map(status => (
              <div key={status} className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] flex flex-col min-h-[500px] sm:min-h-[600px]">
                <div className="p-3 sm:p-4 border-b border-[#334155] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
                      {status}
                    </span>
                    <span className="text-white/60 text-xs sm:text-sm">
                      {filteredTickets.filter(t => t.status === status).length}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto max-h-[400px] sm:max-h-[500px] scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-transparent">
                  {filteredTickets.filter(t => t.status === status).length === 0 && (
                    <div className="text-white/40 text-xs sm:text-sm text-center py-6 sm:py-8">No tickets</div>
                  )}
                  
                  {filteredTickets.filter(t => t.status === status).map(ticket => (
                    <div key={ticket.id} 
                         className="bg-[#22304a] rounded-xl p-3 sm:p-4 shadow border border-[#334155] cursor-pointer hover:bg-[#2a3a5a] transition-all duration-200 group"
                         onClick={() => setSelectedTicket(ticket)}>
                      
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <h3 className="text-white font-medium text-xs sm:text-sm leading-tight flex-1 mr-2">
                          {ticket.title}
                        </h3>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={e => { e.stopPropagation(); setEditTicket(ticket); setShowTicketModal(true); }} 
                                  className="p-1 text-yellow-400 hover:bg-yellow-900/30 rounded transition-colors" 
                                  title="Edit">
                            <FiEdit className="w-3 h-3" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); setDeleteTicketId(ticket.id); }} 
                                  className="p-1 text-red-400 hover:bg-red-900/30 rounded transition-colors" 
                                  title="Delete">
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-white/60 text-xs mb-2 sm:mb-3 line-clamp-2">
                        {ticket.description}
                      </p>
                      
                      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                        <span className={`px-1 sm:px-2 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}>
                          {ticket.status}
                        </span>
                        <div className={`flex items-center gap-1 ${priorityColors[ticket.priority]}`}>
                          {priorityIcons[ticket.priority]}
                          <span className="text-xs">{ticket.priority}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-white/50 space-y-1">
                        <div className="truncate">Assigned: {ticket.assigned}</div>
                        <div>Due: {ticket.due}</div>
                      </div>
                    </div>
                  ))}
                </div>
                

              </div>
            ))}
          </div>
        </div>

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-md border border-[#334155] relative">
              <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-white mb-6">Ticket Details</h2>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-white font-semibold text-lg">{selectedTicket.title}</span>
                  <p className="text-white/70 text-sm mt-2">{selectedTicket.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedTicket.status]}`}>
                    {selectedTicket.status}
                  </span>
                  <div className={`flex items-center gap-1 ${priorityColors[selectedTicket.priority]}`}>
                    {priorityIcons[selectedTicket.priority]}
                    <span className="text-xs">{selectedTicket.priority}</span>
                  </div>
                </div>
                
                <div className="text-sm text-white/60 space-y-1">
                  <div>Assigned: {selectedTicket.assigned}</div>
                  <div>Due: {selectedTicket.due}</div>
                </div>
                
                <div className="mt-4">
                  <span className="text-sm text-white/70 font-semibold flex items-center gap-1 mb-2">
                    <FiActivity /> Activity Log
                  </span>
                  <ul className="pl-4 list-disc text-xs text-white/60">
                    {selectedTicket.activity?.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2" 
                        onClick={() => { setEditTicket(selectedTicket); setShowTicketModal(true); }}>
                  <FiEdit className="w-4 h-4" /> Edit
                </button>
                <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center gap-2" 
                        onClick={() => setDeleteTicketId(selectedTicket.id)}>
                  <FiTrash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Ticket Modal */}
        <TicketModal 
          open={showTicketModal} 
          onClose={() => { setShowTicketModal(false); setEditTicket(null); }} 
          onSave={handleSaveTicket} 
          initial={editTicket} 
          statuses={ticketStatuses} 
        />

        {/* Delete Ticket Confirmation */}
        {deleteTicketId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-sm border border-[#334155] relative flex flex-col items-center">
              <h2 className="text-xl font-bold text-white mb-4">Delete Ticket?</h2>
              <p className="text-white/70 mb-6 text-center">Are you sure you want to delete this ticket? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium" 
                        onClick={() => setDeleteTicketId(null)}>Cancel</button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium" 
                        onClick={() => handleDeleteTicket(deleteTicketId)}>Delete</button>
              </div>
            </div>
          </div>
        )}


      </main>
    </div>
  );
}
