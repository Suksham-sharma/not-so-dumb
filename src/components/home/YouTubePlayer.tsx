"use client";

import { motion } from "framer-motion";
import { YouTubeVideo } from "@/types";

interface YouTubePlayerProps {
  video: YouTubeVideo;
}

export default function YouTubePlayer({ video }: YouTubePlayerProps) {
  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=0&controls=1&modestbranding=1&rel=0`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* Video Header */}
      <div className="p-4 border-b-2 border-black bg-yellow-100 flex justify-between items-center">
        <h3 className="font-heading text-lg text-black line-clamp-2 mb-2">
          {video.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-black/70">
          <span className="bg-orange-200 px-2 py-1 rounded border border-black/20 font-medium">
            {video.duration}
          </span>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative bg-black">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Transcript Indicator */}
      {video.transcript && (
        <div className="p-3 border-t-2 border-black bg-blue-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-medium text-black">
              Transcript Available - Ask questions about this video!
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
