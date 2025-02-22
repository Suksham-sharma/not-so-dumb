"use client";
import React from "react";
import { FileText } from "lucide-react";

interface Pattern {
  color: string;
  top: string;
  left: string;
  size: string;
  rotation: string;
}

interface SavedPattern {
  shapes: Pattern[];
  backgroundColor: string;
}

interface PreviewSectionProps {
  content: string;
  title: string;
  tags: string[];
  savedPattern?: SavedPattern;
}

const generateNeoBrutalistPattern = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#FFD93D",
  ];
  const bgColors = [
    "#FFE5E5",
    "#E8F6F6",
    "#E5F0F5",
    "#EDF4F0",
    "#FFF9E6",
    "#FFF5CC",
  ];
  const shapes = Array.from({ length: 5 }, () => ({
    color: colors[Math.floor(Math.random() * colors.length)],
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${30 + Math.random() * 70}px`,
    rotation: `${Math.random() * 360}deg`,
  }));
  return {
    shapes,
    backgroundColor: bgColors[Math.floor(Math.random() * bgColors.length)],
  };
};

interface GeneratedPattern {
  shapes: Pattern[];
  backgroundColor: string;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  content,
  title,
  tags,
  savedPattern,
}) => {
  const [pattern] = React.useState<GeneratedPattern>(() => {
    if (savedPattern) {
      return {
        shapes: savedPattern.shapes,
        backgroundColor: savedPattern.backgroundColor
      };
    }
    return generateNeoBrutalistPattern();
  });

  if (!content && !title) {
    return (
      <div className="h-[300px] bg-white/50 rounded-lg border-2 border-black p-6 flex flex-col items-center justify-center text-center space-y-4 transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-16 h-16 bg-orange-400 border-2 border-black rounded-lg flex items-center justify-center transform transition-transform hover:scale-105">
          <FileText size={32} />
        </div>
        <h3 className="font-bold text-lg">Preview Your Note</h3>
        <p className="text-gray-600 max-w-sm">
          Start writing your note to see a preview of how it will look.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] bg-white p-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none overflow-hidden group">
      <div
        className="h-48 relative overflow-hidden border-black rounded-lg border-2"
        style={{ backgroundColor: pattern.backgroundColor }}
      >
        {pattern.shapes.map((shape, index) => (
          <div
            key={index}
            className="absolute transform transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-12 rounded-lg"
            style={{
              top: shape.top,
              left: shape.left,
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              transform: `rotate(${shape.rotation}) translateZ(0)`,
              opacity: 0.85,
              backdropFilter: "blur(2px)",
            }}
          />
        ))}
      </div>

      <div className="p-6 flex flex-col justify-between h-[calc(350px-11rem)] bg-white">
        <div className="space-y-3 overflow-hidden">
          <h3 className="font-black text-xl break-words line-clamp-2">
            {title || "Untitled Note"}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{content}</p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-white border-2 border-black rounded-lg text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
