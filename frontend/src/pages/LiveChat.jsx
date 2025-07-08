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

// Mock chat data
const mockChats = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Can you send the latest invoice?",
    time: "09:15 AM",
    unread: 2,
    avatar: null,
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Thanks for the update!",
    time: "Yesterday",
    unread: 0,
    avatar: null,
  },
  {
    id: 3,
    name: "Support Team",
    lastMessage: "Your ticket has been resolved.",
    time: "Mon",
    unread: 1,
    avatar: null,
  },
];

const mockMessages = [
  { id: 1, from: "them", text: "Hi! How can I help you today?", time: "09:00 AM" },
  { id: 2, from: "me", text: "I need help with my order.", time: "09:01 AM" },
  { id: 3, from: "them", text: "Sure! Can you provide your order ID?", time: "09:02 AM" },
  { id: 4, from: "me", text: "#123456", time: "09:03 AM" },
];

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

  const [chats, setChats] = useState(mockChats);
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  const handleNewChat = () => {
    const newId = chats.length + 1;
    const newChat = {
      id: newId,
      name: `New Chat ${newId}`,
      lastMessage: "Start your conversation...",
      time: "Now",
      unread: 0,
      avatar: null,
    };
    setChats([newChat, ...chats]);
    setSelectedChat(newChat);
    setMessages([]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      from: "me",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
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
        {/* Chat List */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border border-[#1e293b]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Chats</h3>
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                onClick={handleNewChat}
              >
                <FiPlus className="w-4 h-4" /> New Chat
              </button>
            </div>
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-[#0f172a] text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="text-white/60 text-center py-8">No chats found.</div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      selectedChat.id === chat.id
                        ? "bg-blue-900/30"
                        : "hover:bg-[#273549]"
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      <FiUser className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate">
                          {chat.name}
                        </span>
                        <span className="text-xs text-white/60 ml-2">
                          {chat.time}
                        </span>
                      </div>
                      <div className="text-xs text-white/60 truncate">
                        {chat.lastMessage}
                      </div>
                    </div>
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {chat.unread}
                      </span>
                    )}
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
                  {selectedChat.name}
                </div>
                <div className="text-xs text-white/60">Online</div>
              </div>
            </div>
            <button className="p-2 text-white/40 hover:text-white hover:bg-[#273549] rounded-lg transition-colors">
              <FiMoreVertical className="w-5 h-5" />
            </button>
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
    </div>
  );
}