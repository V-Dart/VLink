import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import { FiCheckCircle, FiEdit, FiTrash2, FiPlus, FiClipboard, FiX } from "react-icons/fi";

const mockTeams = [
  { id: 1, name: "Alpha Team" },
  { id: 2, name: "Beta Team" },
  { id: 3, name: "Gamma Team" },
];
const mockTasksByTeam = {
  1: [
    { id: 1, title: "Follow up with supplier", status: "In Progress", due: "2024-06-10", assigned: "John Doe" },
    { id: 2, title: "Send invoice to ACME Corp", status: "Completed", due: "2024-06-08", assigned: "Jane Smith" },
    { id: 3, title: "Schedule delivery for Order #1234", status: "Pending", due: "2024-06-12", assigned: "Mike Johnson" },
    { id: 4, title: "Review contract terms", status: "In Progress", due: "2024-06-11", assigned: "Sarah Wilson" },
  ],
  2: [
    { id: 1, title: "Beta: Prepare Q3 report", status: "Pending", due: "2024-06-15", assigned: "Alice" },
  ],
  3: [
    { id: 1, title: "Gamma: Update CRM", status: "In Progress", due: "2024-06-20", assigned: "Bob" },
  ],
};

const statusColors = {
  "Completed": "bg-green-600 text-white",
  "In Progress": "bg-yellow-500 text-white",
  "Pending": "bg-gray-400 text-white",
};

const statusOptions = ["Pending", "In Progress", "Completed"];

function TaskModal({ open, onClose, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [assigned, setAssigned] = useState(initial?.assigned || "");
  const [due, setDue] = useState(initial?.due || "");
  const [status, setStatus] = useState(initial?.status || "Pending");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiX className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold text-white mb-6">{initial ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ title, assigned, due, status }); }} className="flex flex-col gap-4">
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" placeholder="Assigned To" value={assigned} onChange={e => setAssigned(e.target.value)} required />
          <input type="date" className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" value={due} onChange={e => setDue(e.target.value)} required />
          <select className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium mt-2">{initial ? "Save Changes" : "Add Task"}</button>
        </form>
      </div>
    </div>
  );
}

export default function Task() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [teams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const [tasksByTeam, setTasksByTeam] = useState(mockTasksByTeam);
  const tasks = tasksByTeam[selectedTeam] || [];
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

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

  // Add Task
  const handleAddTask = () => {
    setEditTask(null);
    setShowModal(true);
  };
  // Edit Task
  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };
  // Save Task (add or edit)
  const handleSaveTask = (data) => {
    setTasksByTeam(prev => {
      const teamTasks = prev[selectedTeam] || [];
      if (editTask) {
        return {
          ...prev,
          [selectedTeam]: teamTasks.map(t => t.id === editTask.id ? { ...t, ...data } : t)
        };
      } else {
        return {
          ...prev,
          [selectedTeam]: [
            ...teamTasks,
            { ...data, id: Math.max(0, ...teamTasks.map(t => t.id)) + 1 }
          ]
        };
      }
    });
    setShowModal(false);
    setEditTask(null);
  };
  // Delete Task
  const handleDelete = (id) => {
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam]: (prev[selectedTeam] || []).filter(t => t.id !== id)
    }));
  };
  // Mark Complete
  const handleComplete = (id) => {
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam]: (prev[selectedTeam] || []).map(t => t.id === id ? { ...t, status: "Completed" } : t)
    }));
  };

  // Order: In Progress, Pending, Completed
  const orderedStatuses = ["In Progress", "Pending", "Completed"];
  const orderedTasks = [...tasks].sort((a, b) => {
    return orderedStatuses.indexOf(a.status) - orderedStatuses.indexOf(b.status);
  });

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
          <FiClipboard className="w-8 h-8 text-blue-400" /> Task Management
        </h1>
        {/* Team Selector below heading */}
        <div className="flex justify-center mb-6 sm:mb-8 w-full">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-3 shadow mx-auto">
            <span className="text-white font-medium text-base">Team:</span>
            <select
              className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base font-semibold shadow-md hover:border-blue-400 hover:from-blue-800 hover:to-blue-600 cursor-pointer"
              value={selectedTeam}
              onChange={e => { setSelectedTeam(Number(e.target.value)); setEditTask(null); setShowModal(false); }}
            >
              {teams.map(team => (
                <option key={team.id} value={team.id} className="bg-[#1e293b] text-white">{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full max-w-4xl bg-[#1e293b] rounded-2xl shadow-2xl p-4 sm:p-8 border border-[#334155]">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
            <h2 className="text-lg font-semibold text-white">Your Tasks</h2>
            <button onClick={handleAddTask} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md">
              <FiPlus className="w-4 h-4" /> Add Task
            </button>
          </div>
          {/* Classified Task Rows */}
          <div className="flex flex-col gap-8">
            {orderedStatuses.map((status) => (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-base font-bold px-4 py-1 rounded-full shadow-md border-2 border-opacity-60 uppercase tracking-wide
                      ${status === 'In Progress' ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-700/30 border-yellow-500 text-yellow-200'
                        : status === 'Pending' ? 'bg-gradient-to-r from-gray-400/20 to-gray-700/30 border-gray-400 text-gray-200'
                        : 'bg-gradient-to-r from-green-400/20 to-green-700/30 border-green-500 text-green-200'}
                    `}
                  >
                    {status}
                  </span>
                  <span className="text-xs text-gray-400">({orderedTasks.filter(t => t.status === status).length})</span>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orderedTasks.filter(task => task.status === status).length > 0 ? (
                    orderedTasks.filter(task => task.status === status).map(task => (
                      <div key={task.id} className="flex flex-col justify-between bg-[#22304a] rounded-xl p-5 shadow border border-[#334155] min-h-[140px] transition-transform hover:scale-[1.025] hover:shadow-lg">
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-white font-medium truncate text-base">{task.title}</span>
                          <span className="text-xs text-gray-400">Assigned to: {task.assigned}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mt-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>{task.status}</span>
                          <span className="text-xs text-gray-300">Due: {task.due}</span>
                          <button onClick={() => handleComplete(task.id)} className="p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors" title="Mark Complete" disabled={task.status === "Completed"}>
                            <FiCheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleEdit(task)} className="p-2 text-yellow-400 hover:bg-yellow-900/30 rounded-lg transition-colors" title="Edit Task">
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(task.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors" title="Delete Task">
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-400 py-8">No tasks in this status.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <TaskModal
          open={showModal}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSave={handleSaveTask}
          initial={editTask}
        />
      </main>
    </div>
  );
}