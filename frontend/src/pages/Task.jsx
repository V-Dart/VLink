import React, { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import { FiCheckCircle, FiEdit, FiTrash2, FiPlus, FiClipboard, FiX } from "react-icons/fi";

const mockTasks = [
  { id: 1, title: "Follow up with supplier", status: "In Progress", due: "2024-06-10", assigned: "John Doe" },
  { id: 2, title: "Send invoice to ACME Corp", status: "Completed", due: "2024-06-08", assigned: "Jane Smith" },
  { id: 3, title: "Schedule delivery for Order #1234", status: "Pending", due: "2024-06-12", assigned: "Mike Johnson" },
  { id: 4, title: "Review contract terms", status: "In Progress", due: "2024-06-11", assigned: "Sarah Wilson" },
];

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
  const [tasks, setTasks] = useState(mockTasks);
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
    if (editTask) {
      setTasks(tasks.map(t => t.id === editTask.id ? { ...t, ...data } : t));
    } else {
      setTasks([
        ...tasks,
        { ...data, id: Math.max(0, ...tasks.map(t => t.id)) + 1 }
      ]);
    }
    setShowModal(false);
    setEditTask(null);
  };
  // Delete Task
  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };
  // Mark Complete
  const handleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: "Completed" } : t));
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
      <main
        className={`flex-1 flex flex-col items-center px-4 py-10 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        <h1 className="text-3xl font-bold text-white mb-8 mt-4 text-center flex items-center gap-2">
          <FiClipboard className="w-8 h-8 text-blue-400" /> Task Management
        </h1>
        <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-lg p-6 border border-[#334155]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Your Tasks</h2>
            <button onClick={handleAddTask} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <FiPlus className="w-4 h-4" /> Add Task
            </button>
          </div>
          <ul>
            {tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between py-4 border-b border-[#334155] last:border-b-0">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-white font-medium truncate">{task.title}</span>
                  <span className="text-xs text-gray-400">Assigned to: {task.assigned}</span>
                </div>
                <div className="flex items-center gap-4">
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
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="text-center text-gray-400 py-8">No tasks available.</li>
            )}
          </ul>
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