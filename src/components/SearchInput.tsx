import React, { useState, useEffect } from "react";
import { SuggestionType } from "../types";
import { Button } from "./ui/button";

interface SearchInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  buttonText?: string;
  placeholder?: string;
  onTagDetected?: (tags: string[]) => void;
  showQuickTags?: boolean;
}

const quickTags = [
  {
    name: "youtube",
    label: "📺 YouTube",
    color: "bg-red-400",
    hoverColor: "bg-red-100",
    description: "Analyze YouTube videos",
  },
  {
    name: "research",
    label: "🔍 Research",
    color: "bg-blue-400",
    hoverColor: "bg-blue-100",
    description: "Deep research mode",
  },
  {
    name: "compare",
    label: "⚖️ Compare",
    color: "bg-green-400",
    hoverColor: "bg-green-100",
    description: "Compare topics",
  },
];

const detectTags = (text: string): string[] => {
  const tagRegex = /@(\w+)/g;
  const matches = [];
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    matches.push(match[1].toLowerCase());
  }
  return matches;
};

const SearchInput: React.FC<SearchInputProps> = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  buttonText,
  placeholder = "Ask a question...",
  onTagDetected,
  showQuickTags,
}) => {
  const [detectedTags, setDetectedTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const tags = detectTags(input);
    setDetectedTags(tags);
    onTagDetected?.(tags);
  }, [input, onTagDetected]);

  const handleTagClick = (tag: string) => {
    const currentInput = input.trim();
    if (!currentInput.includes(`@${tag}`)) {
      setInput(`@${tag} ${currentInput}`);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedInput = input
      .replace(new RegExp(`@${tagToRemove}\\s*`, "gi"), "")
      .trim();
    setInput(updatedInput);
  };

  const getPlaceholderText = () => {
    if (detectedTags.includes("youtube")) {
      return "Paste YouTube URL or describe the video you want to analyze...";
    }
    if (detectedTags.includes("research")) {
      return "What would you like to research in-depth?";
    }
    if (detectedTags.includes("compare")) {
      return "What would you like to compare?";
    }
    return placeholder;
  };

  const getTagColor = (tag: string) => {
    const tagConfig = quickTags.find((t) => t.name === tag);
    return tagConfig ? tagConfig.color : "bg-blue-400";
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={`relative bg-bg rounded-lg border-2 border-black transition-all duration-200 ${
            isFocused
              ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
              : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          }`}
        >
          {/* Tag indicators */}
          {detectedTags.length > 0 && (
            <div className="absolute -top-3 left-3 flex gap-2 z-10">
              {detectedTags.map((tag) => (
                <div
                  key={tag}
                  className={`px-2 py-1 rounded-md text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 ${getTagColor(
                    tag
                  )} text-white animate-in slide-in-from-top-2 duration-200`}
                >
                  <span>@{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-black/20 rounded-full p-0.5 transition-colors duration-150"
                    title={`Remove @${tag} tag`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={getPlaceholderText()}
            className={`w-full p-3 md:p-5 pr-24 md:pr-32 rounded-lg bg-bg border-none outline-none resize-none h-[72px] md:h-[92px] text-black placeholder-black/70 font-heading text-base md:text-lg transition-all duration-200 ${
              detectedTags.length > 0 ? "pt-6 md:pt-8" : ""
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute right-2 md:right-3 bottom-2 md:bottom-3 flex items-center gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 md:px-6 py-2 md:py-2.5 bg-orange-400 text-black rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm font-heading font-bold"
            >
              <span className="relative z-10">
                {buttonText || (isLoading ? "Thinking..." : "Send")}
              </span>
            </Button>
          </div>
        </div>

        {/* Quick tag buttons */}
        {showQuickTags !== false && (
          <div className="mt-3 flex flex-wrap gap-2">
            {quickTags.map((tag) => (
              <button
                key={tag.name}
                type="button"
                onClick={() => handleTagClick(tag.name)}
                title={tag.description}
                className={`px-3 py-1.5 rounded-md text-xs font-bold border-2 border-black transition-all duration-200 flex items-center gap-1 ${
                  detectedTags.includes(tag.name)
                    ? `${tag.color} text-white shadow-none translate-x-[2px] translate-y-[2px]`
                    : `${tag.hoverColor} text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchInput;
