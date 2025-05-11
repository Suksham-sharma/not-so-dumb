"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinkStyles = `
  relative
  text-sm
  text-black
  px-6
  py-3
  rounded-lg
  border-2
  border-black
  transition-all
  duration-200
  hover:translate-x-[2px]
  hover:translate-y-[2px]
  hover:shadow-none
  flex
  items-center
  gap-2
  font-heading
  font-bold
  bg-white
  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
  hover:bg-yellow-300
  overflow-hidden
  group
  before:content-[''] 
  before:absolute 
  before:top-0 
  before:left-0 
  before:w-4 
  before:h-4 
  before:bg-orange-400 
  before:border-2 
  before:border-black 
  before:-translate-x-2 
  before:-translate-y-2 
  before:rotate-12 
  before:group-hover:rotate-45 
  before:transition-transform
  after:content-[''] 
  after:absolute 
  after:bottom-0 
  after:right-0 
  after:w-3 
  after:h-3 
  after:bg-blue-400 
  after:border-2 
  after:border-black 
  after:translate-x-1 
  after:translate-y-1 
  after:-rotate-12 
  after:group-hover:rotate-45 
  after:transition-transform
`;

interface NavLinksProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isMobile, onItemClick }) => {
  const pathname = usePathname();
  const linkClass = isMobile
    ? `w-full text-left px-4 py-3 text-sm text-black hover:bg-yellow-300 transition-all font-heading font-bold relative overflow-hidden
       before:content-[''] before:absolute before:inset-0 before:bg-yellow-300 before:transform before:translate-y-full before:transition-transform
       hover:before:translate-y-0 hover:text-black group`
    : navLinkStyles;

  return (
    <nav
      className={`${
        isMobile ? "flex flex-col w-full" : "hidden md:flex items-center gap-3"
      }`}
    >
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
