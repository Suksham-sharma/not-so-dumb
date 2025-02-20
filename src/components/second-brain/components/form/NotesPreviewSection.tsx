"use client";
import React from "react";
import { FileText } from "lucide-react";

interface PreviewSectionProps {
  content: string;
  title: string;
  tags: string[];
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  content,
  title,
  tags,
}) => {
  if (!content && !title) {
    return (
      <div className="h-[350px] bg-white/50 rounded-lg border-2 border-black p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-orange-400 border-2 border-black rounded-lg flex items-center justify-center">
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
    <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none h-[350px] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4">
        <h3 className="font-bold text-xl">{title || "Untitled Note"}</h3>
        <div className="prose prose-sm max-w-none">
          {content || "Start writing your note..."}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-orange-100 rounded-md text-sm border border-black"
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