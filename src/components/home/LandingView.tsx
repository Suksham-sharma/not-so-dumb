"use client";

import { motion } from "framer-motion";
import { SuggestionType } from "../../types";
import SearchInput from "../SearchInput";

interface LandingViewProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  selectedSuggestion: string | null;
  handleSuggestionClick: (suggestion: SuggestionType) => void;
}

export default function LandingView({
  input,
  setInput,
  isLoading,
  handleSubmit,
  selectedSuggestion,
  handleSuggestionClick,
}: LandingViewProps) {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-yellow-300 text-black rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 border-2 border-black shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
        >
          Powered by Web Enhanced LLM
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed px-4"
        >
          Do research for your needs in seconds, so you can spend more time
          doing what actually matters.
        </motion.p>{" "}
      </div>
      <div className="w-full max-w-[704px]">
        <SearchInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          selectedSuggestion={selectedSuggestion}
          handleSuggestionClick={handleSuggestionClick}
          showSuggestions={true}
        />
      </div>
    </div>
  );
}
