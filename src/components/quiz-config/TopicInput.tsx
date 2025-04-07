import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  showSources: boolean;
  onToggleSources: () => void;
}

const TopicInput: React.FC<TopicInputProps> = ({
  topic,
  setTopic,
  showSources,
  onToggleSources,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="topic" className="block text-lg font-bold">
          Quiz Topic
        </label>
        <p className="text-sm text-gray-600">
          Enter a topic or subject you want to be quizzed on
        </p>
      </div>

      <div className="relative">
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-3 pr-32 border-2 border-black rounded-lg focus:outline-none bg-white  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all text-sm sm:text-base"
          placeholder="e.g. World War II"
        />
        <button
          type="button"
          onClick={onToggleSources}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border-2 border-black text-sm font-medium transition-all ${
            showSources
              ? "bg-orange-300 shadow-none translate-x-[2px] translate-y-[2px]"
              : "bg-white  translate-x-[1px] translate-y-[2px] hover:shadow-none"
          }`}
        >
          <div className="flex items-center gap-1.5">
            {showSources ? (
              <>
                <Minus className="w-4 h-4" />
                <span>Sources</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="text-xs sm:text-base">Add Sources</span>
              </>
            )}
          </div>
        </button>
      </div>

      {!showSources && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-xs text-gray-500 italic"
        >
          Pro tip: Add sources to generate questions from specific content!
        </motion.p>
      )}
    </div>
  );
};

export default TopicInput;
