"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const TopBar = () => {
  const pathname = usePathname();
  const isQuizPage = pathname === "/quiz";
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="fixed top-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6 z-50 rounded-2xl">
      <h1 className="text-2xl font-heading text-black tracking-tight flex items-center gap-2">
        <span className="text-3xl">🧠</span>
        <span className="relative">
          notSoDumb
          <div className="absolute -bottom-1 left-0 h-2 w-full bg-yellow-300 -z-10" />
        </span>
      </h1>
      <div className="flex items-center gap-4">
        <Link
          href={isQuizPage ? "/home" : "/quiz"}
          className="text-sm text-black bg-yellow-300 px-4 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none flex items-center gap-2 font-heading"
        >
          {isQuizPage ? "Enhanced Search" : "Generate Quiz"}
        </Link>
        {mounted && user && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-blue-300 border-2 border-black  flex items-center justify-center text-xl"
            >
              👤
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-black hover:bg-yellow-300 transition-colors font-heading"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
