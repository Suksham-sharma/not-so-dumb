"use client";

import React from "react";
import NavLinks from "./NavLinks";

interface UserDropdownProps {
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  showDropdown,
  onToggleDropdown,
  onLogout,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggleDropdown}
        className="w-10 h-10 rounded-full bg-blue-300 border-2 border-black flex items-center justify-center text-xl md:text-2xl "
      >
        <span className="md:hidden pb-0.5">☰</span>
        <span className="hidden md:inline">👤</span>
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2">
          <div className="md:hidden border-b-2 border-black">
            <NavLinks isMobile onItemClick={onToggleDropdown} />
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-black hover:bg-yellow-300 transition-colors font-heading"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
