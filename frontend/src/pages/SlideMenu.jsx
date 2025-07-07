import { NavLink } from "react-router-dom";
import React from "react";
import {
  FaTasks,
  FaComments,
  FaChartBar,
  FaProjectDiagram,
  FaStream,
  FaVideo,
} from "react-icons/fa";

const menuItems = [
  { name: "Task", icon: <FaTasks />, to: "/task" },
  { name: "Live Chat", icon: <FaComments />, to: "/livechat" },
  { name: "PowerBI", icon: <FaChartBar />, to: "/powerbi" },
  { name: "Workspace", icon: <FaProjectDiagram />, to: "/workspace" },
  { name: "Pipelines", icon: <FaStream />, to: "/pipelines" },
  { name: "Meet", icon: <FaVideo />, to: "/meet" },
];

export default function SlideMenu({ isOpen, onClose, onMenuHover, onMenuLeave }) {
  return (
    <>
      {/* Overlay dimmer */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-20 transition-opacity duration-300 z-10 ${
          isOpen ? "opacity-200 visible" : "opacity-0 invisible"
        } transition-opacity duration-300 ease-in-out`}
      />

      {/* Sliding panel */}
      <div
        className={`fixed top-0 left-2.5 h-full w-51 bg-[#273549] text-white z-10  
            transition-transform duration-300 ease-in-out
            border-l-2 border-gray-600
            ${ isOpen ? "translate-x-10" : "-translate-x-60"} `}
        onMouseEnter={onMenuHover}
        onMouseLeave={onMenuLeave}
      >
        <div className="p-4 font-semibold text-lg">
          Menu
        </div>
        <nav className="flex flex-col gap-0 mt-0">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-2 mx-4 rounded-lg transition duration-200 ${
                  isActive ? "bg-[#334155]" : "hover:bg-[#334155]/80"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
