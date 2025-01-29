"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, FC } from "react";

interface YellowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const YellowButton: FC<YellowButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        "inline-block px-4 py-1.5 bg-yellow-300 text-black rounded-full text-sm font-bold border-2 border-black shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none",
        className
      )}
    >
      {children}
    </button>
  );
};

export default YellowButton;
