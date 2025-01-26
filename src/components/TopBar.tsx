import React from "react";

const TopBar = () => {
  return (
    <div className="fixed top-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center px-6 z-50 rounded-2xl">
      <h1 className="text-2xl font-heading text-black tracking-tight flex items-center gap-2">
        <span className="text-3xl">🧠</span>
        <span className="relative">
          notSoDumb
          <div className="absolute -bottom-1 left-0 h-2 w-full bg-yellow-300 -z-10" />
        </span>
      </h1>
    </div>
  );
};

export default TopBar;
