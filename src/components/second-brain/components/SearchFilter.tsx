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
    <FadeIn className="mb-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-start relative">
        <div className="relative flex-1">
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
          <div
            ref={dropdownRef}
            className="relative min-w-[240px] md:min-w-[280px]"
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white flex items-center justify-between"
            >
              <span className="font-medium truncate">
                {selectedTags.length === 0
                  ? "All Tags"
                  : `${selectedTags.length} tag${
                      selectedTags.length > 1 ? "s" : ""
                    } selected`}
              </span>
              <ChevronDown
                size={20}
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
              <div className="absolute z-50 w-full mt-2 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-h-[300px] overflow-y-auto">
                <button
                  onClick={() => handleTagSelect("")}
                  className={`w-full px-4 py-3 text-left hover:bg-orange-100 transition-colors border-b-2 border-black font-medium flex items-center gap-3 ${
                    selectedTags.length === 0 ? "bg-orange-200" : ""
                  }`}
                >
                  <div className="w-5 h-5 border-2 border-black rounded flex items-center justify-center bg-white group-hover:bg-orange-100 transition-colors">
                    {selectedTags.length === 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  All Tags
                </button>
                <div className="max-h-[240px] overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className={`w-full px-4 py-3 text-left hover:bg-orange-100 transition-colors font-medium flex items-center gap-3 bg-white group ${
                        selectedTags.includes(tag) ? "bg-orange-200" : ""
                      }`}
                    >
                      <div className="w-5 h-5 border-2 border-black rounded flex items-center justify-center bg-white group-hover:bg-orange-100 transition-colors flex-shrink-0">
                        {selectedTags.includes(tag) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="truncate">{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default SearchFilter;
