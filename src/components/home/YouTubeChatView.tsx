"use client";

import { motion } from "framer-motion";
import { YouTubeVideo, ChatSection, Message } from "@/types";
import YouTubePlayer from "./YouTubePlayer";
import ResultsView from "./ResultsView";

interface YouTubeChatViewProps {
  video: YouTubeVideo;
  chatSections: ChatSection[];
  isLoading: boolean;
  messages: Message[];
  setShowTavilyModal: (show: boolean) => void;
  setSelectedMessageData: (data: { tavily?: any }) => void;
}

export default function YouTubeChatView({
  video,
  chatSections,
  isLoading,
  messages,
  setShowTavilyModal,
  setSelectedMessageData,
}: YouTubeChatViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-12rem)] flex gap-6"
    >
      {/* Left Side - Chat */}
      <div className="flex-1 min-w-0">
        <div className="h-full overflow-y-auto">
          <ResultsView
            chatSections={chatSections}
            isLoading={isLoading}
            messages={messages}
            setShowTavilyModal={setShowTavilyModal}
            setSelectedMessageData={setSelectedMessageData}
          />
        </div>
      </div>

      {/* Right Side - YouTube Player */}
      <div className="w-[400px] lg:w-[480px] flex-shrink-0">
        <div className="sticky top-0">
          <YouTubePlayer video={video} />
        </div>
      </div>
    </motion.div>
  );
}
