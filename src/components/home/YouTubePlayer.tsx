"use client";

import { motion } from "framer-motion";
import { YouTubeVideo } from "@/types";
import { useState } from "react";

interface YouTubePlayerProps {
  video: YouTubeVideo;
}

export default function YouTubePlayer({ video }: YouTubePlayerProps) {
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=0&controls=1&modestbranding=1&rel=0`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* Player Header */}
      <div className="bg-gradient-to-r from-red-100 to-orange-100 border-b-2 border-black p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <span className="text-white text-sm font-bold">▶</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-black text-sm mb-1 line-clamp-1">
              Video Player
            </h3>
            <p className="text-xs text-black/70 font-medium">Watch & analyze</p>
          </div>
          {video.duration && (
            <div className="bg-white px-2 py-1 rounded-md border border-black/20 shadow-sm">
              <span className="text-xs font-bold text-black">
                {video.duration}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Container */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black">
        <div className="aspect-video relative">
          {!isPlayerLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-3"
                />
                <p className="text-white/80 text-sm font-medium">
                  Loading video...
                </p>
              </div>
            </div>
          )}

          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full relative z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsPlayerLoaded(true)}
          />
        </div>

        {/* Video Overlay Controls */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button
            onClick={() => window.open(video.url, "_blank")}
            className="bg-black/70 hover:bg-black/90 text-white px-2 py-1 rounded-md text-xs font-bold border border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            title="Open in YouTube"
          >
            🔗 YouTube
          </button>
        </div>
      </div>

      {/* Player Footer with Status */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-black">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPlayerLoaded ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <span className="font-medium text-black/70">
                  {isPlayerLoaded ? "Ready" : "Loading..."}
                </span>
              </div>

              {video.transcript && (
                <div className="flex items-center gap-1">
                  <span className="text-green-600">📝</span>
                  <span className="font-bold text-green-800">
                    Transcript Ready
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-blue-100 px-2 py-1 rounded-md border border-blue-200">
                <span className="text-xs font-bold text-blue-800">
                  🎬 Analysis Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tip */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-yellow-50 border-t-2 border-black"
      >
        <div className="p-3">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 text-sm">💡</span>
            <div className="flex-1">
              <p className="text-xs text-yellow-800 font-medium leading-relaxed">
                <strong>Tip:</strong> You can ask specific questions about any
                part of this video.
                {video.transcript &&
                  " I have access to the full transcript for detailed analysis!"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
