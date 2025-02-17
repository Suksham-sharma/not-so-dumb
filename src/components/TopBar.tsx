"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import NavLinks from "./TopBar/NavLinks";
import UserDropdown from "./TopBar/UserDropdown";

const TopBar = () => {
  const pathname = usePathname();
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

  const hideTopBarRoutes = ["/"];
  if (hideTopBarRoutes.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6 z-50 rounded-2xl">
      <Link
        href="/"
        className="text-2xl font-heading text-black tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <span className="text-3xl">🧠</span>
        <span className="relative">
          notSoDumb
          <div className="absolute -bottom-1 left-0 h-2 w-full bg-yellow-300 -z-10" />
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <NavLinks />
        {mounted && user && (
          <UserDropdown
            showDropdown={showDropdown}
            onToggleDropdown={() => setShowDropdown(!showDropdown)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;
