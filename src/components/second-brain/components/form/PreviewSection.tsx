"use client";
import React from "react";
import Image from "next/image";
import { Link as LinkIcon } from "lucide-react";

interface PreviewSectionProps {
  preview: {
    title: string;
    image: string | null;
  } | null;
  isLoadingPreview: boolean;
  formTitle?: string;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  preview,
  isLoadingPreview,
  formTitle,
}) => {
  if (isLoadingPreview) {
    return (
      <div className="animate-pulse bg-gray-200 h-[350px] rounded-lg border-2 border-black" />
    );
  }

  if (!preview) {
    return (
      <div className="h-[350px] bg-white/50 rounded-lg border-2 border-black p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-orange-400 border-2 border-black rounded-lg flex items-center justify-center">
          <LinkIcon size={32} />
        </div>
        <h3 className="font-bold text-lg">Preview Your Link</h3>
        <p className="text-gray-600 max-w-sm">
          Enter a URL above to see a preview of the content. We&apos;ll
          automatically fetch the title, description, and image if available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none h-[350px] flex flex-col">
      <div className="flex-1 flex flex-col">
        {preview.image ? (
          <div className="relative h-48 mb-4 flex-shrink-0">
            <Image
              src={preview.image}
              alt={formTitle || preview.title}
              fill
              className="object-cover rounded-lg border-2 border-black"
            />
          </div>
        ) : (
          <div className="h-48 mb-4 flex-shrink-0 bg-gray-100 rounded-lg border-2 border-black flex items-center justify-center">
            <LinkIcon size={48} className="text-gray-400" />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between">
          <h3 className="font-bold text-xl">{formTitle || preview.title}</h3>
          <div className="mt-2 text-sm text-gray-600">
            Click to preview full content
          </div>
        </div>
      </div>
    </div>
  );
};
