"use client";
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

interface SearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onTagSelect: (tag: string) => void;
  availableTags: string[];
  selectedTag: string | null;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchChange,
  onTagSelect,
  availableTags,
  selectedTag,
}) => {
  return (
    <FadeIn className="mb-6 space-y-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="Search your second brain..."
        />
      </div>

      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTagSelect("")}
            className={`px-3 py-1 rounded-full text-sm font-bold border-2 border-black transition-all ${
              !selectedTag
                ? "bg-orange-300 shadow-none translate-x-[2px] translate-y-[2px]"
                : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            All
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagSelect(tag)}
              className={`px-3 py-1 rounded-full text-sm font-bold border-2 border-black transition-all ${
                selectedTag === tag
                  ? "bg-orange-300 shadow-none translate-x-[2px] translate-y-[2px]"
                  : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </FadeIn>
  );
};

export default SearchFilter;
