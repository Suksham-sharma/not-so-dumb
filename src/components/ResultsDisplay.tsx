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
    <div className="bg-transparent mx-4">
      {/* Query */}
      <FadeIn className="my-8">
        <h2 className="text-4xl font-bold text-black mb-4">{section.query}</h2>
      </FadeIn>

      {/* Loading States */}
      {isLoading && (
        <div className="mb-12 flex items-center gap-8 text-base font-heading text-black bg-white/80 p-8 rounded-xl shadow-lg">
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
        <div className="mb-16 animate-pulse bg-white/80 p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-gray-200 rounded" />
            <div className="h-5 w-24 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[320px] bg-gray-50 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="h-48 bg-gray-200 animate-pulse flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-400"
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
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {section.searchResults.length > 0 && (
        <div className="mb-16 bg-white/80 p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <SourceIcon className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-black font-heading">
                Sources
              </h3>
            </div>
            <button
              onClick={onViewTavilyData}
              className="text-sm text-black bg-blue-300 px-4 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none flex items-center gap-2 font-heading"
            >
              <span>View Full Data</span>
              <ArrowIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {section.searchResults.map((result, idx) => (
              <SearchResultCard key={idx} result={result} />
            ))}
          </div>
        </div>
      )}

      {/* Final Report */}
      {section.response && (
        <div className="mt-16 mb-20 bg-white/80 p-8 rounded-xl shadow-lg">
          <div className="prose prose-blue max-w-none space-y-6 text-black font-heading [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-xl [&>h3]:font-bold [&>p]:text-base [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ ...props }) => (
                  <div className="my-8 overflow-x-auto rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                    className="py-4 px-6 font-bold text-sm text-black border-b border-gray-200"
                    {...props}
                  />
                ),
                td: ({ ...props }) => {
                  const content = props.children?.toString() || "";
                  if (content.match(/\[.*?\]\(.*?\)/)) {
                    return (
                      <td className="py-4 px-6 text-base text-gray-700">
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
                      className="py-4 px-6 text-base text-gray-700"
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
        <div className="text-center bg-red-300/90 text-black p-8 rounded-lg mb-8 font-heading text-lg font-medium shadow-lg">
          {section.error}
        </div>
      )}
    </div>
  );
};

// Import SearchResultCard component
import SearchResultCard from "./SearchResultCard";

export default ResultsDisplay;
