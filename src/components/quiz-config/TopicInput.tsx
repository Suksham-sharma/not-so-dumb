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
    <div>
      <label
        htmlFor="topic"
        className="block text-lg font-bold text-black mb-2"
      >
        Quiz Topic
      </label>
      <div className="relative">
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-2 pr-12 border-2 border-black rounded-lg focus:outline-none bg-white"
          placeholder="Enter the topic for your quiz"
          autoComplete="off"
          required
        />
        <button
          type="button"
          onClick={onToggleSources}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg bg-orange-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-200"
        >
          {showSources ? <Minus size={16} /> : <Plus size={16} />}
        </button>
      </div>
    </div>
  );
};

export default TopicInput;
