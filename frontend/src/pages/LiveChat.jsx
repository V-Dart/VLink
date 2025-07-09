import React, { useState, useRef, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiSend,
  FiUser,
  FiMoreVertical,
} from "react-icons/fi";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";

// Mock teams (should match those in Task.jsx)
const mockTeams = [
  { id: 1, name: "Alpha Team" },
  { id: 2, name: "Beta Team" },
  { id: 3, name: "Gamma Team" },
];

// Mock messages per team
const mockTeamMessages = {
  "Alpha Team": [
    { id: 1, from: "them", text: "Welcome to Alpha Team chat!", time: "09:00 AM" },
    { id: 2, from: "me", text: "Hi Alpha Team!", time: "09:01 AM" },
  ],
  "Beta Team": [
    { id: 1, from: "them", text: "Beta Team group chat started.", time: "10:00 AM" },
  ],
  "Gamma Team": [
    { id: 1, from: "them", text: "Gamma Team, let's sync up!", time: "11:00 AM" },
  ],
};

// Mock team members
const mockTeamMembers = {
  "Alpha Team": ["Alice", "Bob", "Charlie"],
  "Beta Team": ["David", "Eve", "Frank"],
  "Gamma Team": ["Grace", "Heidi", "Ivan"],
};

export default function LiveChat() {
  // Sidebar/Menu state and handlers (copied from Meet.jsx for consistency)
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

  // Group chats for each team
  const [teams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState(teams[0].name);
  const [teamMessages, setTeamMessages] = useState({ ...mockTeamMessages });
  const messages = teamMessages[selectedTeam] || [];
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  // Kebab menu state
  const [showMenu, setShowMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, selectedTeam]);

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
    };
    setTeamMessages((prev) => ({
      ...prev,
      [selectedTeam]: [...(prev[selectedTeam] || []), newMessage],
    }));
    setInput("");
  };

  // Rename group handler (mock, just updates local state)
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
  // Leave group handler (mock, just closes modal)
  const handleLeaveGroup = () => {
    setShowLeaveModal(false);
    setShowMenu(false);
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

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
        {/* Team Group Chat List */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border border-[#1e293b]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Team Group Chats</h3>
            </div>
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search teams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTeams.length === 0 ? (
                <div className="text-white/60 text-center py-8">No teams found.</div>
              ) : (
                filteredTeams.map((team) => (
                  <button
                    key={team.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      selectedTeam === team.name
                        ? "bg-blue-900/30"
                        : "hover:bg-[#273549]"
                    }`}
                    onClick={() => setSelectedTeam(team.name)}
                  >
                    <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      <FiUser className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate">
                          {team.name} Chat
                        </span>
                      </div>
                      <div className="text-xs text-white/60 truncate">
                        {teamMessages[team.name]?.length > 0
                          ? teamMessages[team.name][teamMessages[team.name].length - 1].text
                          : "No messages yet."}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-[#1e293b] rounded-xl shadow-lg border border-[#334155]">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-[#334155] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                <FiUser className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-white text-lg">
                  {selectedTeam} Chat
                </div>
                <div className="text-xs text-white/60">Online</div>
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
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#1e293b]"
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
                  {msg.text}
                  <div className="text-xs text-white/50 mt-1 text-right">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 border-t border-[#334155] p-4 bg-[#1e293b]"
          >
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-lg bg-[#0f172a] text-white border border-[#334155] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
      </main>

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
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 w-full max-w-xs border border-[#334155]">
            <h2 className="text-lg font-bold text-white mb-4">Group Members</h2>
            <ul className="mb-4">
              {(mockTeamMembers[selectedTeam] || []).map((member, idx) => (
                <li key={idx} className="text-white py-1">{member}</li>
              ))}
            </ul>
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => setShowMembersModal(false)}
            >
              Close
            </button>
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