// src/pages/Dashboard.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";

export default function Dashboard() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  // Show sidemenu on hamburger hover
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

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Fixed narrow sidebar */}
      <Sidebar
        toggleSlideMenu={handleHamburgerClick}
        onHamburgerHover={handleHamburgerHover}
        onHamburgerLeave={handleHamburgerLeave}
        isPermanent={isPermanent}
      />

      {/* ✅ Separator Line */}
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

      {/* Main dashboard content */}
      <main
        className={`flex-1 flex flex-col items-center justify-center px-4 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        <h1 className="text-3xl font-bold text-white mb-8 mt-12 md:mt-0 text-center">
          Welcome to the Dashboard
        </h1>

        <div className="border-2 border-dashed border-gray-500 rounded-lg bg-[#1e293b] p-10 w-full max-w-xl flex flex-col items-center">
          <span className="text-lg text-white font-semibold mb-2">
            Placeholder for Charts/Cards
          </span>
          <span className="text-gray-400 text-center">
            This area will display your analytics, charts, and quick stats.
          </span>
        </div>
      </main>
    </div>
  );
}
