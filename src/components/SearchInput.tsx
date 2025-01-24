import React from "react";
import { SuggestionType } from "../types";

interface SearchInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  selectedSuggestion: string | null;
  handleSuggestionClick: (suggestion: SuggestionType) => void;
}

const suggestions: SuggestionType[] = [
  { label: "Compare", prefix: "Compare " },
  { label: "Explain", prefix: "Explain " },
  { label: "Analyze", prefix: "Analyze " },
  { label: "Summarize", prefix: "Summarize " },
  { label: "Research", prefix: "Research " },
  { label: "How to", prefix: "How to " },
];

const SearchInput: React.FC<SearchInputProps> = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  selectedSuggestion,
  handleSuggestionClick,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[704px] mx-4">
      <div className="relative bg-orange-300 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-5 pr-32 rounded-lg bg-orange-300 border-none outline-none resize-none h-[92px] text-black placeholder-black/70 font-heading text-lg transition-all duration-200"
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
            className="px-6 py-2.5 bg-green-400 text-black rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed text-sm font-heading font-bold"
          >
            <span className="relative z-10">
              {isLoading ? "Thinking..." : "Send"}
            </span>
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`px-4 py-2 rounded-base text-sm font-heading transition-all duration-200 border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none ${
              selectedSuggestion === suggestion.label
                ? "bg-blue-300 text-black"
                : "bg-white text-black hover:bg-gray-100"
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
