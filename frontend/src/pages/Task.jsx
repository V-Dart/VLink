import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import { FiCheckCircle, FiEdit, FiTrash2, FiPlus, FiClipboard, FiX } from "react-icons/fi";

const mockTeams = [
  { id: 1, name: "Alpha Team" },
  { id: 2, name: "Beta Team" },
  { id: 3, name: "Gamma Team" },
];
const mockTicketsByTeam = {
  1: [
    { id: 1, title: "Follow up with supplier", status: "Assigned", due: "2024-06-10", assigned: "Alpha Team" },
    { id: 2, title: "Send invoice to ACME Corp", status: "Assigned", due: "2024-06-08", assigned: "Alpha Team" },
    { id: 3, title: "Schedule delivery for Order #1234", status: "Pending", due: "2024-06-12", assigned: "" },
    { id: 4, title: "Review contract terms", status: "Assigned", due: "2024-06-11", assigned: "Alpha Team" },
  ],
  2: [
    { id: 1, title: "Beta: Prepare Q3 report", status: "Pending", due: "2024-06-15", assigned: "" },
  ],
  3: [
    { id: 1, title: "Gamma: Update CRM", status: "Assigned", due: "2024-06-20", assigned: "Gamma Team" },
  ],
};

const statusColors = {
  "Assigned": "bg-yellow-500 text-white",
  "Pending": "bg-gray-400 text-white",
};

const statusOptions = ["Pending", "Assigned"];

function TicketModal({ open, onClose, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [assigned, setAssigned] = useState(initial?.assigned || "");
  const [due, setDue] = useState(initial?.due || "");
  const [status, setStatus] = useState(initial?.status || "Pending");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiX className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold text-white mb-6">{initial ? "Edit Ticket" : "Add Ticket"}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ title, assigned, due, status }); }} className="flex flex-col gap-4">
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Ticket Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Assigned To" value={assigned} onChange={e => setAssigned(e.target.value)} required />
          <input type="date" className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" value={due} onChange={e => setDue(e.target.value)} required />
          <select className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium mt-2">{initial ? "Save Changes" : "Add Ticket"}</button>
        </form>
      </div>
    </div>
  );
}

export default function TicketManagement() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [teams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [ticketsByTeam, setTicketsByTeam] = useState(mockTicketsByTeam);
  // Pending tickets: always show all
  const pendingTickets = Object.values(ticketsByTeam).flat().filter(ticket => ticket.status === 'Pending');
  // Assigned tickets: filter by team selector
  let assignedTickets = [];
  if (selectedTeam === 'all') {
    assignedTickets = Object.values(ticketsByTeam).flat().filter(ticket => ticket.status === 'Assigned');
  } else {
    assignedTickets = (ticketsByTeam[selectedTeam] || []).filter(ticket => ticket.status === 'Assigned');
  }
  const [showModal, setShowModal] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  // Assign popup state: track which ticket's assign menu is open and due date
  const [assignMenuTicketId, setAssignMenuTicketId] = useState(null);
  const [assignDueDate, setAssignDueDate] = useState("");
  const [assignTeam, setAssignTeam] = useState("");

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

  // Add Ticket
  const handleAddTicket = () => {
    setEditTicket(null);
    setShowModal(true);
  };
  // Edit Ticket
  const handleEdit = (ticket) => {
    setEditTicket(ticket);
    setShowModal(true);
  };
  // Save Ticket (add or edit)
  const handleSaveTicket = (data) => {
    setTicketsByTeam(prev => {
      const teamTickets = prev[selectedTeam] || [];
      if (editTicket) {
        return {
          ...prev,
          [selectedTeam]: teamTickets.map(t => t.id === editTicket.id ? { ...t, ...data } : t)
        };
      } else {
        return {
          ...prev,
          [selectedTeam]: [
            ...teamTickets,
            { ...data, id: Math.max(0, ...teamTickets.map(t => t.id)) + 1 }
          ]
        };
      }
    });
    setShowModal(false);
    setEditTicket(null);
  };
  // Delete Ticket
  const handleDelete = (id) => {
    setTicketsByTeam(prev => ({
      ...prev,
      [selectedTeam]: (prev[selectedTeam] || []).filter(t => t.id !== id)
    }));
  };

  // Assign handler
  const handleAssign = (ticketId) => {
    if (!assignTeam || !assignDueDate) return;
    setTicketsByTeam(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(teamId => {
        updated[teamId] = updated[teamId].map(t =>
          t.id === ticketId ? { ...t, assigned: assignTeam, status: "Assigned", due: assignDueDate } : t
        );
      });
      return updated;
    });
    setAssignMenuTicketId(null);
    setAssignDueDate("");
    setAssignTeam("");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Team Selector */}
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
      <main
        className={`flex-1 flex flex-col items-center px-2 sm:px-4 py-8 sm:py-10 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        <h1 className="text-3xl font-bold text-white mb-6 sm:mb-8 mt-2 sm:mt-4 text-center flex items-center gap-2">
          <FiClipboard className="w-8 h-8 text-blue-400" /> Ticket Management
        </h1>
        {/* Team Selector below heading */}
        <div className="flex justify-center mb-6 sm:mb-8 w-full">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-3 shadow mx-auto">
            <span className="text-white font-medium text-base">Team:</span>
            <select
              className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-semibold shadow-md hover:border-blue-400 hover:from-blue-800 hover:to-blue-600 cursor-pointer"
              value={selectedTeam}
              onChange={e => { setSelectedTeam(e.target.value); setEditTicket(null); setShowModal(false); }}
            >
              <option value="all" className="bg-[#1e293b] text-white">Show All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.id} className="bg-[#1e293b] text-white">{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full max-w-4xl bg-[#1e293b] rounded-2xl shadow-2xl p-4 sm:p-8 border border-[#334155]">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
          </div>
          {/* Classified Ticket Rows */}
          <div className="flex flex-col gap-8">
            {/* Pending column: always show all pending tickets */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-base font-bold px-4 py-1 rounded-full shadow-md border-2 border-opacity-60 uppercase tracking-wide bg-gradient-to-r from-gray-400/20 to-gray-700/30 border-gray-400 text-gray-200`}>
                  Pending
                </span>
                <span className="text-xs text-gray-400">({pendingTickets.length})</span>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingTickets.length > 0 ? (
                  pendingTickets.map(ticket => (
                    <div key={ticket.id} className="flex flex-col justify-between bg-[#22304a] rounded-xl p-5 shadow border border-[#334155] min-h-[140px] transition-transform hover:scale-[1.025] hover:shadow-lg">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-white font-medium truncate text-base">{ticket.title}</span>
                        {/* No 'Assigned to:' for pending tickets */}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}>{ticket.status}</span>
                      </div>
                      <div className="flex justify-center gap-4 mt-4">
                        <div className="relative">
                          <button
                            onClick={() => {
                              setAssignMenuTicketId(ticket.id);
                              setAssignTeam("");
                              setAssignDueDate("");
                            }}
                            className="p-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            Assign
                          </button>
                          {assignMenuTicketId === ticket.id && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-10 z-50 bg-[#1e293b] border border-[#334155] rounded-lg shadow-lg min-w-[220px] p-4 flex flex-col gap-3">
                              <label className="text-xs text-white mb-1">Select Team</label>
                              <select
                                className="w-full px-3 py-2 rounded bg-[#273549] text-white focus:outline-none border border-[#334155]"
                                value={assignTeam}
                                onChange={e => setAssignTeam(e.target.value)}
                              >
                                <option value="" disabled>Select team</option>
                                {teams.map(team => (
                                  <option key={team.id} value={team.name}>{team.name}</option>
                                ))}
                              </select>
                              <label className="text-xs text-white mb-1">Due Date</label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 rounded bg-[#273549] text-white focus:outline-none border border-[#334155]"
                                value={assignDueDate}
                                onChange={e => setAssignDueDate(e.target.value)}
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
                                  onClick={() => handleAssign(ticket.id)}
                                  disabled={!assignTeam || !assignDueDate}
                                >
                                  Assign
                                </button>
                                <button
                                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors font-medium"
                                  onClick={() => setAssignMenuTicketId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <button onClick={() => handleEdit(ticket)} className="p-2 text-yellow-400 hover:bg-yellow-900/30 rounded-lg transition-colors" title="Edit Ticket">
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(ticket.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Ticket">
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-8">No tickets in this status.</div>
                )}
              </div>
            </div>
            {/* Assigned column: filter by team selector */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-base font-bold px-4 py-1 rounded-full shadow-md border-2 border-opacity-60 uppercase tracking-wide bg-gradient-to-r from-yellow-400/20 to-yellow-700/30 border-yellow-500 text-yellow-200`}>
                  Assigned
                </span>
                <span className="text-xs text-gray-400">({assignedTickets.length})</span>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedTickets.length > 0 ? (
                  assignedTickets.map(ticket => (
                    <div key={ticket.id} className="flex flex-col justify-between bg-[#22304a] rounded-xl p-5 shadow border border-[#334155] min-h-[140px] transition-transform hover:scale-[1.025] hover:shadow-lg">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-white font-medium truncate text-base">{ticket.title}</span>
                        <span className="text-xs text-gray-400">Assigned to: {ticket.assigned}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}>{ticket.status}</span>
                        <span className="text-xs text-gray-300">Due: {ticket.due}</span>
                      </div>
                      <div className="flex justify-center gap-4 mt-4">
                        <button onClick={() => handleEdit(ticket)} className="p-2 text-yellow-400 hover:bg-yellow-900/30 rounded-lg transition-colors" title="Edit Ticket">
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(ticket.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Ticket">
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-8">No tickets in this status.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <TicketModal
          open={showModal}
          onClose={() => { setShowModal(false); setEditTicket(null); }}
          onSave={handleSaveTicket}
          initial={editTicket}
        />
      </main>
    </div>
  );
}