"use client";
import React, { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagSelect = (tag: string) => {
    if (tag === "") {
      setSelectedTags([]);
      onTagSelect("");
    } else {
      const updatedTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      setSelectedTags(updatedTags);
      onTagSelect(updatedTags[updatedTags.length - 1] || "");
    }
  };

  return (
    <FadeIn className="mb-6 space-y-4 max-w-xl mx-auto">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="Search your second brain..."
        />
      </div>

      {availableTags.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white flex items-center justify-between"
          >
            <span className="font-medium">
              {selectedTags.length === 0
                ? "All Tags"
                : `${selectedTags.length} tag${
                    selectedTags.length > 1 ? "s" : ""
                  } selected`}
            </span>
            <ChevronDown
              size={20}
              className={`transform transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-200 rounded-lg border-2 border-black text-sm font-bold"
                >
                  {tag}
                  <button
                    onClick={() => handleTagSelect(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-h-64 overflow-y-auto">
              <button
                onClick={() => handleTagSelect("")}
                className={`w-full px-4 py-3 text-left hover:bg-orange-100 transition-colors border-b-2 border-black font-medium ${
                  selectedTags.length === 0 ? "bg-orange-200" : ""
                }`}
              >
                All Tags
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`w-full px-4 py-3 text-left hover:bg-orange-100 transition-colors border-b-2 border-black last:border-b-0 font-medium flex items-center justify-between ${
                    selectedTags.includes(tag) ? "bg-orange-200" : ""
                  }`}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <span className="text-orange-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </FadeIn>
  );
};

export default SearchFilter;
