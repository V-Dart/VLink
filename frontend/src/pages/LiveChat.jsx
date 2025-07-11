import React, { useState, useRef, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiSend,
  FiUser,
  FiMoreVertical,
  FiCalendar,
  FiUsers,
  FiClock,
  FiLink,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiVideo,
  FiShare2,
  FiDownload,
  FiClipboard,
  FiX,
  FiMessageCircle
} from "react-icons/fi";
import { format, addDays, startOfWeek, addHours, startOfDay, isSameDay, parseISO } from "date-fns";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GoogleCalendarConnection from "../components/GoogleCalendarConnection";

// Mock data for CRM
const mockTeams = [
  { id: 1, name: "Alpha Team", members: ["Alice", "Bob", "Charlie"], color: "blue" },
  { id: 2, name: "Beta Team", members: ["David", "Eve", "Frank"], color: "green" },
  { id: 3, name: "Gamma Team", members: ["Grace", "Heidi", "Ivan"], color: "purple" },
];

const mockMeetings = [
  // Alpha Team Meetings
  {
    id: 1,
    title: "Alpha Team Weekly Standup",
    date: "2024-01-15",
    time: "09:00",
    duration: 30,
    participants: ["Alice", "Bob", "Charlie"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_alpha_001",
    recurring: "Weekly",
    status: "upcoming",
    description: "Weekly standup to discuss Alpha team progress and blockers",
    team: "Alpha Team"
  },
  {
    id: 2,
    title: "Alpha Project Review",
    date: "2024-01-16",
    time: "14:00",
    duration: 60,
    participants: ["Alice", "Bob", "Charlie", "Project Manager"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_alpha_002",
    recurring: null,
    status: "upcoming",
    description: "Review of Alpha team's current project milestones",
    team: "Alpha Team"
  },
  {
    id: 3,
    title: "Alpha Code Review",
    date: "2024-01-17",
    time: "11:00",
    duration: 45,
    participants: ["Alice", "Bob"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_alpha_003",
    recurring: "Bi-weekly",
    status: "upcoming",
    description: "Code review session for Alpha team's recent changes",
    team: "Alpha Team"
  },

  // Beta Team Meetings
  {
    id: 4,
    title: "Beta Team Sprint Planning",
    date: "2024-01-15",
    time: "10:30",
    duration: 90,
    participants: ["David", "Eve", "Frank"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_beta_001",
    recurring: "Bi-weekly",
    status: "upcoming",
    description: "Sprint planning session for Beta team's next iteration",
    team: "Beta Team"
  },
  {
    id: 5,
    title: "Beta Client Presentation",
    date: "2024-01-18",
    time: "15:00",
    duration: 75,
    participants: ["David", "Eve", "Client Representatives"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_beta_002",
    recurring: null,
    status: "upcoming",
    description: "Presentation of Beta team's deliverables to client",
    team: "Beta Team"
  },
  {
    id: 6,
    title: "Beta Retrospective",
    date: "2024-01-19",
    time: "16:00",
    duration: 60,
    participants: ["David", "Eve", "Frank"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_beta_003",
    recurring: "Weekly",
    status: "upcoming",
    description: "End of sprint retrospective for Beta team",
    team: "Beta Team"
  },

  // Gamma Team Meetings
  {
    id: 7,
    title: "Gamma Team Architecture Review",
    date: "2024-01-16",
    time: "13:00",
    duration: 120,
    participants: ["Grace", "Heidi", "Ivan", "Tech Lead"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_gamma_001",
    recurring: "Monthly",
    status: "upcoming",
    description: "Architecture review and system design discussion",
    team: "Gamma Team"
  },
  {
    id: 8,
    title: "Gamma Team Training Session",
    date: "2024-01-20",
    time: "10:00",
    duration: 90,
    participants: ["Grace", "Heidi", "Ivan"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_gamma_002",
    recurring: "Monthly",
    status: "upcoming",
    description: "Training session on new technologies and best practices",
    team: "Gamma Team"
  },
  {
    id: 9,
    title: "Gamma Team Innovation Workshop",
    date: "2024-01-22",
    time: "14:30",
    duration: 150,
    participants: ["Grace", "Heidi", "Ivan", "Innovation Lead"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_gamma_003",
    recurring: null,
    status: "upcoming",
    description: "Workshop to explore new ideas and innovative solutions",
    team: "Gamma Team"
  }
];

// Mock messages per team
const mockTeamMessages = {
  "Alpha Team": [
    { id: 1, from: "them", text: "Welcome to Alpha Team chat!", time: "09:00 AM", sender: "Alice" },
    { id: 2, from: "me", text: "Hi Alpha Team!", time: "09:01 AM", sender: "You" },
    { id: 3, from: "them", text: "How's the Acme Corp project going?", time: "09:02 AM", sender: "Bob" },
  ],
  "Beta Team": [
    { id: 1, from: "them", text: "Beta Team group chat started.", time: "10:00 AM", sender: "David" },
    { id: 2, from: "them", text: "TechStart Inc follow-up needed", time: "10:01 AM", sender: "Eve" },
  ],
  "Gamma Team": [
    { id: 1, from: "them", text: "Gamma Team, let's sync up!", time: "11:00 AM", sender: "Grace" },
    { id: 2, from: "them", text: "Global Solutions contract review", time: "11:01 AM", sender: "Heidi" },
  ],
};

// Enhanced Mini Calendar with CRM styling
function MiniCalendar({ selectedDate, onSelect, meetings, onViewAll }) {
  const weekStart = startOfWeek(new Date());
  
  const getMeetingsForDay = (day) => {
    return meetings.filter(m => isSameDay(parseISO(m.date), day));
  };

  return (
    <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border border-[#1e293b]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Calendar</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium" onClick={onViewAll}>View All</button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-white/70 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {[...Array(7)].map((_, i) => {
          const day = addDays(weekStart, i);
          const isSelected = isSameDay(day, selectedDate);
          const dayMeetings = getMeetingsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={i}
              onClick={() => onSelect(day)}
              className={`
                relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : isToday 
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {format(day, "d")}
              {dayMeetings.length > 0 && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#334155]">
        <h4 className="text-sm font-medium text-white mb-2">Today's Meetings</h4>
        {getMeetingsForDay(selectedDate).slice(0, 2).map(meeting => (
          <div key={meeting.id} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-800 truncate">{meeting.title}</div>
              <div className="text-xs text-gray-500">{meeting.time}</div>
            </div>
          </div>
        ))}
        {getMeetingsForDay(selectedDate).length === 0 && (
          <div className="text-xs text-white/60 text-center py-2">No meetings scheduled</div>
        )}
      </div>
    </div>
  );
}



// Meeting Card Component
function MeetingCard({ meeting, onShowDetails, menuOpen, onMenuOpen, onMenuClose, onDelete, onCopyLink, onEdit, onJoinMeeting, showAllMeetings }) {
  const isUpcoming = meeting.status === 'upcoming';
  const menuRef = React.useRef();

  React.useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onMenuClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen, onMenuClose]);

  return (
    <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] hover:shadow-md transition-all duration-200 mb-4 overflow-visible">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
              {meeting.recurring && (
                <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs font-medium rounded-full">{meeting.recurring}</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-white/80 mb-3">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                <span>{format(parseISO(meeting.date), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{meeting.time} ({meeting.duration} min)</span>
              </div>
              <div className="flex items-center gap-1">
                <FiUsers className="w-4 h-4" />
                <span>{meeting.participants.length} participants</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => onJoinMeeting(meeting)}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <FiVideo className="w-4 h-4" />
                Join Meeting
              </button>
            </div>
            {showAllMeetings && meeting.team && (
              <div className="flex items-center gap-1 text-sm text-white/70 mb-3">
                <FiUsers className="w-4 h-4" />
                <span>Team: {meeting.team}</span>
              </div>
            )}
            {meeting.customer && (
              <div className="flex items-center gap-1 text-sm text-white/70 mb-3">
                <FiUser className="w-4 h-4" />
                <span>Customer: {meeting.customer}</span>
              </div>
            )}
            {meeting.description && (
              <p className="text-sm text-white/70 mb-4">{meeting.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            <button
              className="p-2 text-white/40 hover:text-white hover:bg-[#273549] rounded-lg transition-colors"
              onClick={menuOpen ? onMenuClose : onMenuOpen}
            >
              <FiMoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#273549] border border-[#334155] rounded-lg shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 text-white hover:bg-[#334155] transition-colors"
                  onClick={onShowDetails}
                >
                  View Details
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-white hover:bg-[#334155] transition-colors"
                  onClick={onEdit}
                >
                  Edit Meeting
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-white hover:bg-[#334155] transition-colors"
                  onClick={onCopyLink}
                >
                  Copy Link
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/30 transition-colors"
                  onClick={onDelete}
                >
                  Delete Meeting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Meeting Modal Component
function MeetingModal({ open, onClose, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(initial?.date || "");
  const [time, setTime] = useState(initial?.time || "");
  const [duration, setDuration] = useState(initial?.duration || 30);
  const [participants, setParticipants] = useState(initial?.participants?.join(', ') || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [meetLink, setMeetLink] = useState(initial?.meetLink || "");
  const [recurring, setRecurring] = useState(initial?.recurring || "");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiX className="w-5 h-5" /></button>
        <h2 className="text-xl font-bold text-white mb-6">{initial ? "Edit Meeting" : "Schedule Meeting"}</h2>
        <form onSubmit={e => { 
          e.preventDefault(); 
          onSave({ 
            title, 
            date, 
            time, 
            duration: Number(duration), 
            participants: participants.split(',').map(p => p.trim()).filter(Boolean),
            description,
            meetLink,
            recurring: recurring || null,
            status: 'upcoming'
          }); 
        }} className="flex flex-col gap-4">
          <input 
            className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" 
            placeholder="Meeting Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
          <input 
            type="date" 
            className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
          />
          <input 
            type="time" 
            className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" 
            value={time} 
            onChange={e => setTime(e.target.value)} 
            required 
          />
          <select 
            className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" 
            value={duration} 
            onChange={e => setDuration(e.target.value)}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
          <input 
            className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" 
            placeholder="Participants (comma separated)" 
            value={participants} 
            onChange={e => setParticipants(e.target.value)} 
            required 
          />
          <textarea 
            className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" 
            placeholder="Description" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            rows={3}
          />
          <input 
            className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" 
            placeholder="Meeting Link" 
            value={meetLink} 
            onChange={e => setMeetLink(e.target.value)} 
            required 
          />
          <select 
            className="rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none" 
            value={recurring} 
            onChange={e => setRecurring(e.target.value)}
          >
            <option value="">No Recurrence</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium mt-2">
            {initial ? "Update Meeting" : "Schedule Meeting"}
          </button>
        </form>
      </div>
    </div>
  );
}



export default function LiveChat() {
  // Sidebar/Menu state and handlers
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

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

  // CRM State
  const [teams, setTeams] = useState(mockTeams);
  const [meetings, setMeetings] = useState(mockMeetings);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].name);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('meetings'); // meetings, chat
  const [search, setSearch] = useState("");
  const [showAllMeetings, setShowAllMeetings] = useState(false);

  // Chat State
  const [teamMessages, setTeamMessages] = useState({ ...mockTeamMessages });
  const messages = teamMessages[selectedTeam] || [];
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Meeting State
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editMeeting, setEditMeeting] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [filter, setFilter] = useState({ date: null, assignedTo: null });
  const [googleConnected, setGoogleConnected] = useState(false);



  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, selectedTeam]);

  // Chat handlers
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage = {
      id: (teamMessages[selectedTeam]?.length || 0) + 1,
      from: "me",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "You"
    };
    setTeamMessages((prev) => ({
      ...prev,
      [selectedTeam]: [...(prev[selectedTeam] || []), newMessage],
    }));
    setInput("");
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(true);
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const handleRenameGroup = () => {
    if (!renameValue.trim()) return;
    setTeamMessages((prev) => {
      const newTeamMessages = { ...prev };
      newTeamMessages[renameValue] = newTeamMessages[selectedTeam] || [];
      delete newTeamMessages[selectedTeam];
      return newTeamMessages;
    });
    setSelectedTeam(renameValue);
    setShowRenameModal(false);
    setShowMenu(false);
  };

  const handleLeaveGroup = () => {
    setShowLeaveModal(false);
    setShowMenu(false);
  };

  // Team management handlers
  const handleAddTeamMember = (teamName, memberName) => {
    setTeams(prev => prev.map(team => 
      team.name === teamName 
        ? { ...team, members: [...team.members, memberName] }
        : team
    ));
  };

  const handleRemoveTeamMember = (teamName, memberName) => {
    setTeams(prev => prev.map(team => 
      team.name === teamName 
        ? { ...team, members: team.members.filter(m => m !== memberName) }
        : team
    ));
  };





  // Meeting handlers
  const handleAddMeeting = () => {
    setEditMeeting(null);
    setShowMeetingModal(true);
  };

  const handleSaveMeeting = (data) => {
    if (editMeeting) {
      setMeetings(prev => prev.map(m => m.id === editMeeting.id ? { ...m, ...data } : m));
    } else {
      setMeetings(prev => [...prev, { ...data, id: Math.max(0, ...prev.map(m => m.id)) + 1 }]);
    }
    setShowMeetingModal(false);
    setEditMeeting(null);
  };

  const handleDeleteMeeting = (id) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('Meeting link copied to clipboard!');
  };

  const handleEditMeeting = (meeting) => {
    setEditMeeting(meeting);
    setShowMeetingModal(true);
  };

  const handleJoinMeeting = (meeting) => {
    window.open(meeting.meetLink, '_blank');
  };

  const handleUpdateMeetingStatus = (meetingId, newStatus) => {
    setMeetings(prev => prev.map(m => 
      m.id === meetingId ? { ...m, status: newStatus } : m
    ));
  };

  const handleViewAllMeetings = () => {
    setShowAllMeetings(true);
    setActiveTab('meetings');
  };

  const handleCloseViewAll = () => {
    setShowAllMeetings(false);
  };

  const handleGoogleConnectionChange = (connected) => {
    setGoogleConnected(connected);
  };

  const filteredMeetings = meetings.filter(m => {
    if (filter.date && m.date !== filter.date) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (!showAllMeetings && m.team && m.team !== selectedTeam) return false;
    return true;
  });

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

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col lg:flex-row gap-6 p-6 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Left Sidebar - Calendar and Team Selector */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} meetings={meetings} onViewAll={handleViewAllMeetings} />
          
          {/* Google Calendar Connection - Only show in meetings tab */}
          {activeTab === 'meetings' && (
            <GoogleCalendarConnection onConnectionChange={handleGoogleConnectionChange} />
          )}
          
                    {/* Team Management Card */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border border-[#1e293b]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Team Management</h3>
            </div>
            <div className="space-y-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    selectedTeam === team.name
                      ? "bg-blue-900/30 border border-blue-500"
                      : "hover:bg-[#273549] border border-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 bg-${team.color}-800 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    <FiUsers className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-semibold text-white truncate">
                      {team.name}
                    </div>
                    <div className="text-xs text-white/60 truncate">
                      {team.members.length} members
                    </div>
                    <div className="text-xs text-white/40 truncate mt-1">
                      {team.members.slice(0, 3).join(', ')}
                      {team.members.length > 3 && ` +${team.members.length - 3} more`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Header with Tabs */}
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border border-[#334155]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {showAllMeetings ? "All Meetings" : "Team Communication & Meetings"}
                </h1>
                <p className="text-white/70 mt-1">
                  {showAllMeetings ? "Viewing all meetings across all teams" : "Manage meetings and team communication"}
                </p>
              </div>
              <div className="flex gap-2">
                {showAllMeetings && (
                  <button 
                    onClick={handleCloseViewAll}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition-colors font-medium"
                  >
                    <FiX className="w-4 h-4" />
                    Close View All
                  </button>
                )}
                {activeTab === 'meetings' && (
                  <button 
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium"
                    onClick={handleAddMeeting}
                  >
                    <FiPlus className="w-4 h-4" />
                    Schedule Meeting
                  </button>
                )}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-1 bg-[#273549] p-1 rounded-lg">
              {[
                { id: 'meetings', label: 'Meetings', icon: FiCalendar },
                { id: 'chat', label: 'Team Chat', icon: FiMessageCircle }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-[#1e293b] text-blue-400 shadow-sm' 
                        : 'text-white hover:text-blue-200'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar - Only for Meetings */}
          {activeTab === 'meetings' && (
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border border-[#334155]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search meetings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'meetings' && (
            <div>
              {filteredMeetings.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl shadow-lg p-12 flex flex-col items-center justify-center text-center min-h-[300px] border border-[#334155]">
                  <div className="w-16 h-16 bg-[#273549] rounded-full flex items-center justify-center mb-6">
                    <FiCalendar className="w-8 h-8 text-white/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No meetings found</h3>
                  <p className="text-white/60 mb-8">No meetings match your current filters.</p>
                  <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    onClick={handleAddMeeting}
                  >
                    Schedule Your First Meeting
                  </button>
                </div>
              ) : (
                <div className="bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] overflow-hidden">
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(3 * 200px + 2rem)' }}>
                    <div className="space-y-4 p-6">
                      {filteredMeetings.map(meeting => (
                        <MeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          onShowDetails={() => setShowDetails(meeting)}
                          menuOpen={openMenuId === meeting.id}
                          onMenuOpen={() => setOpenMenuId(meeting.id)}
                          onMenuClose={() => setOpenMenuId(null)}
                          onDelete={() => handleDeleteMeeting(meeting.id)}
                          onCopyLink={() => handleCopyLink(meeting.meetLink)}
                          onEdit={() => handleEditMeeting(meeting)}
                          onJoinMeeting={handleJoinMeeting}
                          showAllMeetings={showAllMeetings}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

                    {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col bg-[#1e293b] rounded-xl shadow-lg border border-[#334155] max-h-[85vh]">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-[#334155] p-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    <FiUsers className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">
                      {selectedTeam} Chat
                    </div>
                    <div className="text-xs text-white/60">
                      {isTyping ? "Someone is typing..." : "Online"}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    className="p-2 text-white/40 hover:text-white hover:bg-[#273549] rounded-lg transition-colors"
                    onClick={() => setShowMenu((v) => !v)}
                  >
                    <FiMoreVertical className="w-4 h-4" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#273549] border border-[#334155] rounded-lg shadow-lg z-50 animate-fade-in">
                      <button
                        className="w-full text-left px-4 py-2 text-white hover:bg-[#334155] transition-colors"
                        onClick={() => { setShowRenameModal(true); setRenameValue(selectedTeam); setShowMenu(false); }}
                      >
                        Rename Group
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-white hover:bg-[#334155] transition-colors"
                        onClick={() => { setShowMembersModal(true); setShowMenu(false); }}
                      >
                        View Members
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/30 transition-colors"
                        onClick={() => { setShowLeaveModal(true); setShowMenu(false); }}
                      >
                        Leave Group
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatWindowRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#1e293b] min-h-0"
                style={{ maxHeight: 'calc(85vh - 200px)' }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                        msg.from === "me"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-[#273549] text-white rounded-bl-none"
                      }`}
                    >
                      <div className="text-xs text-white/50 mb-1">{msg.sender}</div>
                      {msg.text}
                      <div className="text-xs text-white/50 mt-1 text-right">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-3 border-t border-[#334155] p-4 bg-[#1e293b] flex-shrink-0"
              >
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg bg-[#0f172a] text-white border border-[#334155] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message..."
                  value={input}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <FiSend className="w-5 h-5" />
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Meeting Modal */}
      <MeetingModal
        open={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSave={handleSaveMeeting}
        initial={editMeeting}
      />



      {/* Rename Group Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-xs border border-[#334155]">
            <h2 className="text-lg font-bold text-white mb-4">Rename Group</h2>
            <input
              className="w-full px-4 py-2 rounded-lg bg-[#273549] text-white border border-[#334155] mb-4"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              placeholder="New group name"
            />
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={handleRenameGroup}
              >
                Rename
              </button>
              <button
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                onClick={() => setShowRenameModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-md border border-[#334155]">
            <h2 className="text-lg font-bold text-white mb-4">{selectedTeam} Members</h2>
            <div className="mb-4 max-h-60 overflow-y-auto">
              {teams.find(t => t.name === selectedTeam)?.members.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between text-white py-2 border-b border-[#334155]">
                  <span>{member}</span>
                  <button
                    onClick={() => handleRemoveTeamMember(selectedTeam, member)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new member"
                className="flex-1 rounded-lg px-4 py-2 bg-[#273549] text-white focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleAddTeamMember(selectedTeam, e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setShowMembersModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Leave Group Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-xs border border-[#334155]">
            <h2 className="text-lg font-bold text-white mb-4">Leave Group</h2>
            <p className="text-white mb-4">Are you sure you want to leave <span className="font-semibold">{selectedTeam} Chat</span>?</p>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                onClick={handleLeaveGroup}
              >
                Leave
              </button>
              <button
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                onClick={() => setShowLeaveModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}