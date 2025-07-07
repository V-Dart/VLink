import React, { useState } from "react";
import { FiPlus, FiCalendar, FiUsers, FiClock, FiLink, FiEdit, FiTrash2, FiCheckCircle, FiVideo, FiMoreVertical, FiShare2, FiDownload } from "react-icons/fi";
import { format, addDays, startOfWeek, addHours, startOfDay, isSameDay, parseISO } from "date-fns";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Enhanced mock data with more realistic meeting times and links
const mockMeetings = [
  {
    id: 1,
    title: "Weekly Team Standup",
    date: "2024-01-15",
    time: "09:00",
    duration: 30,
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_123456789",
    recurring: "Weekly",
    status: "upcoming",
    description: "Daily standup to discuss progress and blockers"
  },
  {
    id: 2,
    title: "Client Demo - ABC Corp",
    date: "2024-01-15",
    time: "14:00",
    duration: 60,
    participants: ["Sarah Wilson", "Client Team"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_987654321",
    recurring: null,
    status: "upcoming",
    description: "Product demonstration for potential client"
  },
  {
    id: 3,
    title: "Project Planning Session",
    date: "2024-01-16",
    time: "10:30",
    duration: 90,
    participants: ["Dev Team", "Product Manager"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_456789123",
    recurring: null,
    status: "upcoming",
    description: "Q1 project planning and roadmap discussion"
  },
  {
    id: 4,
    title: "Code Review Meeting",
    date: "2024-01-16",
    time: "16:00",
    duration: 45,
    participants: ["Senior Devs", "Tech Lead"],
    meetLink: "https://teams.microsoft.com/l/meetup-join/19:meeting_789123456",
    recurring: "Bi-weekly",
    status: "upcoming",
    description: "Review of recent code changes and architecture decisions"
  }
];

const mockSuggestions = [
  { time: "10:00 AM", label: "Best", available: true },
  { time: "2:00 PM", label: "Free", available: true },
  { time: "4:30 PM", label: "Good", available: false },
];

// Enhanced Mini Calendar with Teams-like styling
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
      
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-white/70 py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
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
      
      {/* Today's meetings preview */}
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

// Enhanced Meeting Card with Teams-like design
function MeetingCard({ meeting, onShowDetails }) {
  const isUpcoming = meeting.status === 'upcoming';
  const timeUntil = meeting.time; // You can calculate actual time until meeting
  
  return (
    <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] hover:shadow-md transition-all duration-200 mb-4 overflow-hidden">
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
            
            {meeting.description && (
              <p className="text-sm text-white/70 mb-4">{meeting.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/40 hover:text-white hover:bg-[#273549] rounded-lg transition-colors">
              <FiMoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => window.open(meeting.meetLink, "_blank")}
            >
              <FiVideo className="w-4 h-4" />
              Join Meeting
            </button>
            <button 
              className="flex items-center gap-2 bg-[#273549] text-white px-4 py-2 rounded-lg hover:bg-[#334155] transition-colors"
              onClick={() => navigator.clipboard.writeText(meeting.meetLink)}
            >
              <FiShare2 className="w-4 h-4" />
              Copy Link
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-white/40 hover:text-white hover:bg-[#273549] rounded-lg transition-colors"
              onClick={() => onShowDetails(meeting)}
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button className="p-2 text-white/40 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Smart Suggestions
function SmartSuggestions({ suggestions, onSelect }) {
  return (
    <div className="bg-[#1e293b] rounded-lg p-4 mb-4">
      <h4 className="text-sm font-medium text-white mb-2">Smart Suggestions</h4>
      <div className="flex gap-2">
        {suggestions.map((s, i) => (
          <button 
            key={i} 
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              s.available 
                ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                : 'bg-[#273549] text-white/40 cursor-not-allowed'
            }`}
            onClick={() => s.available && onSelect(s.time)}
            disabled={!s.available}
          >
            {s.time} <span className="font-bold">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Meet() {
  // Sidebar/Menu state and handlers (copied from Dashboard for consistency)
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

  // State
  const [googleConnected, setGoogleConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Upcoming");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState({ date: null, assignedTo: "" });
  const [meetings, setMeetings] = useState(mockMeetings);
  // In Meet component, add state and handler for 'View All' modal
  const [showAllMeetings, setShowAllMeetings] = useState(false);
  const handleViewAll = () => setShowAllMeetings(true);
  const handleCloseViewAll = () => setShowAllMeetings(false);

  // Handlers (replace with real logic)
  const handleConnectGoogle = () => setGoogleConnected(true);
  const handleSchedule = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowDetails = (meeting) => setShowDetails(meeting);
  const handleCloseDetails = () => setShowDetails(null);

  // Update filteredMeetings to apply filters
  const filteredMeetings = meetings.filter(m => {
    // Date filter: if a date is selected, only show meetings on that date
    if (filter.date && m.date !== filter.date) return false;
    // Assigned To filter: if a participant is selected, only show meetings where they are included
    if (filter.assignedTo && !m.participants.some(p => p.toLowerCase().includes(filter.assignedTo.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Fixed narrow sidebar */}
      <Sidebar
        toggleSlideMenu={handleHamburgerClick}
        onHamburgerHover={handleHamburgerHover}
        onHamburgerLeave={handleHamburgerLeave}
        isPermanent={isPermanent}
      />
      {/* Separator Line */}
      {isMenuOpen && (
        <div className="fixed top-0 left-16 h-full z-10"></div>
      )}
      {/* Slide-out panel */}
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => {
          if (!isPermanent) setMenuOpen(false);
        }}
        onMenuHover={handleMenuHover}
        onMenuLeave={handleMenuLeave}
      />
      {/* Main Meet content */}
      <main
        className={`flex-1 flex flex-col lg:flex-row gap-6 p-6 transition-all duration-300 ${isMenuOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}
      >
        {/* Left Sidebar - Calendar */}
        <aside className="w-full lg:w-80 flex-shrink-0 sticky top-6 self-start h-fit">
          <div>
            <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} meetings={meetings} onViewAll={handleViewAll} />
            {!googleConnected ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Connect Calendar</h4>
                    <p className="text-xs text-blue-600 mb-3">Sync with Google Calendar for automatic meeting creation</p>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      onClick={handleConnectGoogle}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 mb-6 flex items-center gap-3">
                <FiCheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-green-200 font-medium">Calendar Connected</span>
              </div>
            )}
          </div>
        </aside>
        
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Sticky Meetings Card (Header, Tabs) */}
          <div className="sticky top-6 z-20 bg-[#0f172a] rounded-xl">
            {/* Header */}
            <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Meetings</h1>
                  <p className="text-white mt-1">Manage your meetings and schedule new ones</p>
                </div>
                <button 
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium"
                  onClick={handleSchedule}
                >
                  <FiPlus className="w-5 h-5" />
                  Schedule Meeting
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-1 bg-[#273549] p-1 rounded-lg">
                {['Upcoming', 'Past', 'All'].map(tab => (
                  <button
                    key={tab}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedTab === tab 
                        ? 'bg-[#1e293b] text-blue-400 shadow-sm' 
                        : 'text-white hover:text-blue-200'
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Filters (not sticky) */}
          <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-2">Date Range</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none w-5 h-5" />
                  <ReactDatePicker
                    selected={filter.date ? new Date(filter.date) : null}
                    onChange={date => setFilter(f => ({ ...f, date: date ? date.toISOString().slice(0, 10) : null }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#0f172a] text-white placeholder-white"
                    calendarClassName="bg-[#1e293b] text-white border border-[#334155] rounded-lg shadow-lg"
                    dayClassName={date => "text-white"}
                    popperClassName="z-50"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    showPopperArrow={false}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-2">Assigned To</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#0f172a] text-white"
                  onChange={e => setFilter(f => ({ ...f, assignedTo: e.target.value }))}
                >
                  <option value="">All Team Members</option>
                  <option value="John">John Doe</option>
                  <option value="Jane">Jane Smith</option>
                  <option value="Mike">Mike Johnson</option>
                </select>
              </div>
            </div>
          </div>
          {/* Meeting List with scroll */}
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {filteredMeetings.length === 0 ? (
              <div className="bg-[#1e293b] rounded-xl shadow-sm border border-[#334155] p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 bg-[#273549] rounded-full flex items-center justify-center mb-6">
                  <FiCalendar className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No meetings found</h3>
                <p className="text-white/60 mb-8">No meetings match your current filters.</p>
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  onClick={handleSchedule}
                >
                  Schedule Your First Meeting
                </button>
              </div>
            ) : (
              filteredMeetings.map(m => (
                <MeetingCard key={m.id} meeting={m} onShowDetails={handleShowDetails} />
              ))
            )}
          </div>
        </div>
        
        {/* Schedule Meeting Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Schedule New Meeting</h2>
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <form className="space-y-6">
                  <div className="relative">
                    <input
                      id="meeting-title"
                      className="peer w-full px-4 pt-6 pb-2 border border-[#334155] rounded-lg bg-[#0f172a] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=" "
                      autoComplete="off"
                    />
                    <label htmlFor="meeting-title" className="absolute left-4 top-2 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">Meeting Title</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        id="meeting-date"
                        type="date"
                        className="peer w-full px-4 pt-6 pb-2 border border-[#334155] rounded-lg bg-[#0f172a] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder=" "
                        autoComplete="off"
                      />
                      <label htmlFor="meeting-date" className="absolute left-4 top-2 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">Date</label>
                    </div>
                    <div className="relative">
                      <input
                        id="meeting-time"
                        type="time"
                        className="peer w-full px-4 pt-6 pb-2 border border-[#334155] rounded-lg bg-[#0f172a] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder=" "
                        autoComplete="off"
                      />
                      <label htmlFor="meeting-time" className="absolute left-4 top-2 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">Time</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        id="meeting-duration"
                        type="number"
                        className="peer w-full px-4 pt-6 pb-2 border border-[#334155] rounded-lg bg-[#0f172a] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder=" "
                        autoComplete="off"
                      />
                      <label htmlFor="meeting-duration" className="absolute left-4 top-2 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">Duration (minutes)</label>
                    </div>
                    <div className="relative">
                      <select
                        id="meeting-recurrence"
                        className="peer w-full px-4 pt-6 pb-2 border border-[#334155] rounded-lg bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="One-time"
                      >
                        <option>One-time</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                      <label htmlFor="meeting-recurrence" className="absolute left-4 top-2 text-white/60 text-sm transition-all duration-200 peer-focus:text-blue-400">Recurrence</label>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      id="meeting-participants"
                      className="peer w-full px-4 pt-6 pb-2 border border-[#334155] rounded-lg bg-[#0f172a] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=" "
                      autoComplete="off"
                    />
                    <label htmlFor="meeting-participants" className="absolute left-4 top-2 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">Participants (comma separated)</label>
                  </div>
                  <div className="relative">
                    <textarea
                      id="meeting-description"
                      className="peer w-full px-4 pt-6 pb-2 border border-[#334155] rounded-lg bg-[#0f172a] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=" "
                      rows="3"
                    />
                    <label htmlFor="meeting-description" className="absolute left-4 top-2 text-white/60 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">Description/Notes</label>
                  </div>
                  <div className="mb-3">
                    <label className="flex items-center gap-2 text-white/60">
                      <input type="checkbox" className="accent-blue-600" /> Recurring Meeting
                    </label>
                  </div>
                  <SmartSuggestions suggestions={mockSuggestions} onSelect={time => {}} />
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      className="flex-1 bg-[#273549] text-white px-6 py-3 rounded-lg hover:bg-[#334155] transition-colors font-medium"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Schedule Meeting
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Meeting Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] rounded-xl shadow-xl w-full max-w-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Meeting Details</h2>
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={handleCloseDetails}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{showDetails.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{format(parseISO(showDetails.date), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        <span>{showDetails.time} ({showDetails.duration} min)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Participants</h4>
                    <div className="flex flex-wrap gap-2">
                      {showDetails.participants.map((participant, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Meeting Link</h4>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <FiLink className="w-4 h-4 text-gray-400" />
                      <a 
                        href={showDetails.meetLink} 
                        className="text-blue-600 hover:text-blue-700 text-sm truncate flex-1"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {showDetails.meetLink}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button 
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      onClick={() => window.open(showDetails.meetLink, "_blank")}
                    >
                      Join Meeting
                    </button>
                    <button 
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      onClick={() => navigator.clipboard.writeText(showDetails.meetLink)}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Render the View All modal */}
      {showAllMeetings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#334155] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">All Meetings This Week</h2>
              <button className="p-2 text-white/40 hover:text-white hover:bg-[#273549] rounded-lg transition-colors" onClick={handleCloseViewAll}>✕</button>
            </div>
            <div className="p-6">
              {meetings.length === 0 ? (
                <div className="text-white/60 text-center py-8">No meetings scheduled this week.</div>
              ) : (
                meetings.map(m => (
                  <div key={m.id} className="mb-4 p-4 rounded-lg bg-[#273549] text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{m.title}</span>
                      {m.recurring && <span className="ml-2 px-2 py-1 bg-blue-900/30 text-blue-300 text-xs font-medium rounded-full">{m.recurring}</span>}
                    </div>
                    <div className="text-sm text-white/80 mb-1">{m.date} at {m.time} ({m.duration} min)</div>
                    <div className="text-xs text-white/60 mb-1">Participants: {m.participants.join(", ")}</div>
                    <div className="text-xs text-white/60">{m.description}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}