"use client";
import React from "react";
import { Tag, X } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

interface Shape {
  color: string;
  top: string;
  left: string;
  size: string;
  rotation: string;
}

interface Pattern {
  shapes: Shape[];
  backgroundColor: string;
}

interface NoteDisplayProps {
  title: string;
  content?: string;
  tags: string[];
  pattern?: Pattern;
  onClose: () => void;
}

const NoteDisplay: React.FC<NoteDisplayProps> = ({
  title,
  content,
  tags,
  pattern,
  onClose,
}) => {
  return (
    <FadeIn>
      <div className="fixed inset-0 bg-gradient-to-br from-orange-50 to-blue-50 z-50 overflow-y-auto">
        <div className="min-h-screen p-8">
          <button
            onClick={onClose}
            className="fixed top-4 right-4 w-12 h-12 bg-red-400 text-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center z-10"
          >
            <X size={20} />
          </button>

          <div
            className="h-48 mb-8 rounded-lg border-2 border-black relative overflow-hidden"
            style={{
              backgroundColor: pattern?.backgroundColor || "#FFE5E5",
            }}
          >
            {pattern?.shapes.map((shape, index) => (
              <div
                key={index}
                className="absolute transform transition-all duration-700 ease-in-out rounded-lg"
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

          <div className="flex flex-col gap-6 mx-4">
            <h1 className="text-4xl font-bold">{title}</h1>

            <div className="prose prose-lg mb-8 max-w-none">{content}</div>
          </div>

          <div className="flex gap-2 flex-wrap mx-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-bold rounded-md border-2 border-black transition-all hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url(https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(
                    tag
                  )})`,
                }}
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default NoteDisplay;