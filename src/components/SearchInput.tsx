import React from "react";
import { SuggestionType } from "../types";

interface SearchInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  suggestions: SuggestionType[];
  selectedSuggestion: string | null;
  handleSuggestionClick: (suggestion: SuggestionType) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  suggestions,
  selectedSuggestion,
  handleSuggestionClick,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[704px] mx-4">
      <div className="relative bg-gray-50 rounded-xl shadow-md border border-gray-300">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-5 pr-32 rounded-xl border-2 border-transparent focus:border-gray-900 focus:shadow-lg focus:outline-none resize-none h-[92px] bg-gray-50 transition-all duration-200 text-gray-900 placeholder-gray-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isLoading ? "Thinking..." : "Send"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedSuggestion === suggestion.label
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </form>
  );
};

export default SearchInput;
