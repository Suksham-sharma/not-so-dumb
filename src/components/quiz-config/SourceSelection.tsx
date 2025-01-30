import React from "react";
import { motion } from "framer-motion";
import YoutubeIcon from "../icons/YoutubeIcon";
import SourceIcon from "../icons/SourceIcon";
import FolderIcon from "../icons/FolderIcon";

interface SourceSelectionProps {
  sourceType: "youtube" | "article" | null;
  onSourceTypeChange: (type: "youtube" | "article") => void;
  youtubeLink: string;
  articleLink: string;
  onYoutubeLinkChange: (link: string) => void;
  onArticleLinkChange: (link: string) => void;
}

const SourceSelection: React.FC<SourceSelectionProps> = ({
  sourceType,
  onSourceTypeChange,
  youtubeLink,
  articleLink,
  onYoutubeLinkChange,
  onArticleLinkChange,
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 space-y-4"
    >
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={() => onSourceTypeChange("youtube")}
          className={`flex-1 py-1 px-4 rounded-lg border-2 border-black transition-all ${
            sourceType === "youtube"
              ? "bg-orange-300 shadow-none translate-x-[2px] translate-y-[2px]"
              : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          }`}
        >
          <div className="flex items-center gap-2 justify-center">
            <YoutubeIcon className="w-6 h-6" />
            <span className="font-medium text-sm">YouTube</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onSourceTypeChange("article")}
          className={`flex-1 py-1 px-4 rounded-lg border-2 border-black transition-all ${
            sourceType === "article"
              ? "bg-orange-300 shadow-none translate-x-[2px] translate-y-[2px]"
              : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          }`}
        >
          <div className="flex items-center gap-2 justify-center">
            <FolderIcon className="w-6 h-6" />
            <span className="font-medium text-sm">Article</span>
          </div>
        </button>
      </div>

      {sourceType === "youtube" && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-black">
            YouTube Link
          </label>
          <input
            type="url"
            value={youtubeLink}
            onChange={(e) => onYoutubeLinkChange(e.target.value)}
            className="w-full px-3 py-1.5 border-2 border-black rounded-lg focus:outline-none bg-white text-sm"
            placeholder="Enter YouTube link"
            autoComplete="off"
          />
        </div>
      )}

      {sourceType === "article" && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-black">
            Article Link
          </label>
          <input
            type="url"
            value={articleLink}
            onChange={(e) => onArticleLinkChange(e.target.value)}
            className="w-full px-3 py-1.5 border-2 border-black rounded-lg focus:outline-none bg-white text-sm"
            placeholder="Enter article link"
            autoComplete="off"
          />
        </div>
      )}
    </motion.div>
  );
};

export default SourceSelection;
