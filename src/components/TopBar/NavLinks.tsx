"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinkStyles =
  "text-sm text-black px-4 py-2 rounded-lg border-2 border-black transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none flex items-center gap-2 font-heading bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:shadow-[2px_1px_0px_0px_rgba(0,0,0,1)]";

interface NavLinksProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isMobile, onItemClick }) => {
  const pathname = usePathname();
  const linkClass = isMobile
    ? "w-full text-left px-4 py-2 text-sm text-black hover:bg-yellow-300 transition-colors font-heading"
    : navLinkStyles;

  return (
    <nav className={`${isMobile ? "flex flex-col w-full" : "hidden md:flex items-center gap-3"}`}>
      {pathname !== "/home" && (
        <Link href="/home" className={linkClass} onClick={onItemClick}>
          Enhanced Search
        </Link>
      )}
      {pathname !== "/quiz" && (
        <Link href="/quiz" className={linkClass} onClick={onItemClick}>
          Generate Quiz
        </Link>
      )}
      {pathname !== "/second-brain" && (
        <Link href="/second-brain" className={linkClass} onClick={onItemClick}>
          Second Brain
        </Link>
      )}
    </nav>
  );
};

export default NavLinks;
