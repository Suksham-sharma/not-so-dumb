"use client";
import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, X, Tag } from "lucide-react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <FadeIn className="w-full">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start relative">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all placeholder:text-gray-400 text-sm md:text-base"
            placeholder="Search your second brain..."
          />
        </div>

        {availableTags.length > 0 && (
          <div
            ref={dropdownRef}
            className="relative w-full md:w-auto md:min-w-[200px]"
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-2.5 md:p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white flex items-center justify-between"
            >
              <span className="font-medium truncate text-sm md:text-base">
                {selectedTags.length === 0
                  ? "All Tags"
                  : `${selectedTags.length} tag${
                      selectedTags.length > 1 ? "s" : ""
                    } selected`}
              </span>
              <ChevronDown
                size={16}
                className={`transform transition-transform flex-shrink-0 ml-2 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {selectedTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-200 rounded-lg border-2 border-black text-sm font-bold group hover:bg-white transition-colors"
                    style={{
                      backgroundSize: "cover",
                      backgroundImage: `url(https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(
                        tag
                      )})`,
                    }}
                  >
                    <Tag size={12} />
                    {tag}
                    <button
                      onClick={() => handleTagSelect(tag)}
                      className="group-hover:text-black transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-1">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`w-full text-left px-3 py-1.5 text-sm md:text-base hover:bg-orange-100 transition-colors ${
                      selectedTags.includes(tag) ? "bg-orange-100" : ""
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default SearchFilter;
