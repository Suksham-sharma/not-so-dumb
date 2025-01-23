import React from "react";
import Image from "next/image";
import { SearchResult } from "../types";

interface SearchResultCardProps {
  result: SearchResult;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  return (
    <div className="flex-shrink-0 w-[300px] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <div className="h-40 bg-gray-200 overflow-hidden relative">
        {result.image ? (
          <>
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            <Image
              src={result.image.url}
              alt={result.image.description || result.title}
              className="w-full h-full object-cover relative z-10"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.opacity = "1";
              }}
              style={{
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              width={300}
              height={160}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-2 font-medium line-clamp-2"
        >
          {result.title}
        </a>
        <p className="text-sm text-gray-600 line-clamp-3">{result.content}</p>
      </div>
    </div>
  );
};

export default SearchResultCard;
