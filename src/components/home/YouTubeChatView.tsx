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
  onQuickAction?: (action: string) => void;
}

export default function YouTubeChatView({
  video,
  chatSections,
  isLoading,
  messages,
  setShowTavilyModal,
  setSelectedMessageData,
  onQuickAction,
}: YouTubeChatViewProps) {
  const handleQuickAction = (action: string) => {
    if (onQuickAction) {
      onQuickAction(action);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] relative">
      {/* Main Content Layout - 2 columns */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
        style={{ height: "calc(100vh - 12rem)" }}
      >
        {/* Left Side - Chat Section with Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 order-2 lg:order-1 flex flex-col"
          style={{ height: "calc(100vh - 12rem)" }}
        >
          <div className="flex flex-col bg-white rounded-xl h-full">
            {/* Quick Actions Bar */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    handleQuickAction(
                      "What are the key insights from this video?"
                    )
                  }
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200 text-xs flex items-center gap-1"
                >
                  <span>💡</span>
                  <span>Key insights</span>
                </button>

                <button
                  onClick={() =>
                    handleQuickAction("Summarize the main points of this video")
                  }
                  className="px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-md transition-colors duration-200 text-xs flex items-center gap-1"
                >
                  <span>📋</span>
                  <span>Summarize</span>
                </button>

                {video.transcript && (
                  <button
                    onClick={() =>
                      handleQuickAction(
                        "What are the most important quotes from this video?"
                      )
                    }
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors duration-200 text-xs flex items-center gap-1"
                  >
                    <span>💬</span>
                    <span>Find quotes</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    handleQuickAction(
                      "Explain the main concepts discussed in this video"
                    )
                  }
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md transition-colors duration-200 text-xs flex items-center gap-1"
                >
                  <span>🧠</span>
                  <span>Explain concepts</span>
                </button>

                {/* Video metadata in the same row */}
                <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                  {video.duration && <span>⏱️ {video.duration}</span>}
                  {video.transcript && (
                    <span className="text-green-600">📝 Transcript</span>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Results */}
            <div className="flex-1 overflow-y-auto">
              <ResultsView
                chatSections={chatSections}
                isLoading={isLoading}
                messages={messages}
                setShowTavilyModal={setShowTavilyModal}
                setSelectedMessageData={setSelectedMessageData}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Side - Video Player */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 order-1 lg:order-2"
          style={{ height: "calc(100vh - 12rem)" }}
        >
          <div className="h-full flex flex-col justify-start">
            {/* YouTube Player */}
            <div className="w-full">
              <YouTubePlayer video={video} />
            </div>

            {/* Additional space could be used for future features */}
            <div className="flex-1 mt-4">
              {/* Empty space - could add features like chat history, bookmarks, etc. */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
