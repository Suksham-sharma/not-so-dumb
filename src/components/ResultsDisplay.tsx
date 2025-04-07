import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatSection } from "../types";
import SourceIcon from "./icons/SourceIcon";
import ArrowIcon from "./icons/ArrowIcon";
import { FadeIn } from "./ui/motion";

interface LoadingIndicatorProps {
  text: string;
  color: string;
  delay?: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  text,
  color,
  delay = 0,
}) => (
  <FadeIn delay={delay} className="flex items-center gap-2">
    <div className={`w-2 h-2 ${color} rounded-full animate-pulse`} />
    <span>{text}</span>
  </FadeIn>
);

interface ResultsDisplayProps {
  section: ChatSection;
  isLoading: boolean;
  onToggleReasoning: () => void;
  onViewTavilyData: () => void;
  onViewReasoningInput: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  section,
  isLoading,
  onToggleReasoning,
  onViewTavilyData,
  onViewReasoningInput,
}) => {
  return (
    <div className="bg-transparent mx-2 md:mx-4">
      {/* Query */}
      <FadeIn className="my-4 md:my-8">
        <h2 className="text-2xl md:text-4xl font-bold text-black mb-2 md:mb-4">
          {section.query}
        </h2>
      </FadeIn>

      {/* Loading States */}
      {isLoading && (
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-sm md:text-base font-heading text-black bg-white/80 p-4 md:p-8 rounded-xl shadow-lg">
          <LoadingIndicator text="Loading Sources" color="bg-blue-500" />
          <LoadingIndicator
            text="Reading Content"
            color="bg-green-500"
            delay={2}
          />
          <LoadingIndicator
            text="Analyzing Data"
            color="bg-purple-500"
            delay={4}
          />
        </div>
      )}

      {/* Search Results Loading State */}
      {section.isLoadingSources && (
        <div className="mb-8 md:mb-16 animate-pulse bg-white/80 p-4 md:p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded" />
            <div className="h-4 w-20 md:h-5 md:w-24 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-2 md:-mx-4 px-2 md:px-4">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[240px] md:w-[320px] bg-gray-50 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="h-32 md:h-48 bg-gray-200 animate-pulse flex items-center justify-center">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-gray-400"
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
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <div className="h-4 md:h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {section.searchResults.length > 0 && (
        <div className="mb-8 md:mb-16 bg-white/80 p-4 md:p-8 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <SourceIcon className="w-5 h-5 md:w-6 md:h-6 text-black" />
              <h3 className="text-lg md:text-xl font-bold text-black font-heading">
                Sources
              </h3>
            </div>
            <button
              onClick={onViewTavilyData}
              className="text-xs md:text-sm text-black bg-blue-300 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none flex items-center gap-1.5 md:gap-2 font-heading"
            >
              <span>View Full Data</span>
              <ArrowIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-2 md:-mx-4 px-2 md:px-4">
            {section.searchResults.map((result, idx) => (
              <SearchResultCard key={idx} result={result} />
            ))}
          </div>
        </div>
      )}

      {/* Final Report */}
      {section.response && (
        <div className="mt-8 md:mt-16 mb-12 md:mb-20 bg-white/80 p-4 md:p-8 rounded-xl shadow-lg">
          <div className="prose prose-blue max-w-none space-y-4 md:space-y-6 text-black font-heading [&>h1]:text-2xl md:[&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-xl md:[&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-lg md:[&>h3]:text-xl [&>h3]:font-bold [&>p]:text-sm md:[&>p]:text-base [&>ul]:list-disc [&>ul]:pl-4 md:[&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-4 md:[&>ol]:pl-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ ...props }) => (
                  <div className="my-4 md:my-8 overflow-x-auto rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <table
                      className="w-full text-left border-collapse"
                      {...props}
                    />
                  </div>
                ),
                thead: ({ ...props }) => (
                  <thead className="bg-gray-50" {...props} />
                ),
                tbody: ({ ...props }) => (
                  <tbody
                    className="bg-white divide-y divide-gray-200"
                    {...props}
                  />
                ),
                tr: ({ ...props }) => (
                  <tr
                    className="hover:bg-gray-50 transition-colors"
                    {...props}
                  />
                ),
                th: ({ ...props }) => (
                  <th
                    className="py-3 md:py-4 px-4 md:px-6 font-bold text-xs md:text-sm text-black border-b border-gray-200"
                    {...props}
                  />
                ),
                td: ({ ...props }) => {
                  const content = props.children?.toString() || "";
                  if (content.match(/\[.*?\]\(.*?\)/)) {
                    return (
                      <td className="py-3 md:py-4 px-4 md:px-6 text-sm md:text-base text-gray-700">
                        <ReactMarkdown
                          components={{
                            a: ({ ...linkProps }) => (
                              <a
                                {...linkProps}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            ),
                          }}
                        >
                          {content}
                        </ReactMarkdown>
                      </td>
                    );
                  }
                  return (
                    <td
                      className="py-3 md:py-4 px-4 md:px-6 text-sm md:text-base text-gray-700"
                      {...props}
                    />
                  );
                },
              }}
            >
              {section.response}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {section.error && (
        <div className="text-center bg-red-300/90 text-black p-4 md:p-8 rounded-lg mb-4 md:mb-8 font-heading text-sm md:text-lg font-medium shadow-lg">
          {section.error}
        </div>
      )}
    </div>
  );
};

// Import SearchResultCard component
import SearchResultCard from "./SearchResultCard";

export default ResultsDisplay;
