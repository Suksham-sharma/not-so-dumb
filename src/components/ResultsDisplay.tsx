import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatSection } from "../types";
import SourceIcon from "./icons/SourceIcon";
import ThinkingIcon from "./icons/ThinkingIcon";
import ArrowIcon from "./icons/ArrowIcon";

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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    className="flex items-center gap-2"
  >
    <div className={`w-2 h-2 ${color} rounded-full animate-pulse`} />
    <span>{text}</span>
  </motion.div>
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
    <div className="pt-8 border-b border-gray-200 last:border-0">
      {/* Query */}
      <div className="mb-8">
        <p className="text-lg text-gray-800">{section.query}</p>
      </div>

      {/* Loading States */}
      {isLoading && (
        <div className="mb-6 flex items-center gap-8 text-sm text-gray-500">
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

      {/* Sources Loading State */}
      {section.isLoadingSources && (
        <div className="mb-12 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[300px] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="h-40 bg-gray-200 animate-pulse flex items-center justify-center">
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
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
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
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <SourceIcon />
              <h3 className="text-sm font-semibold text-gray-600">Sources</h3>
            </div>
            <button
              onClick={onViewTavilyData}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Full Data</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4">
            {section.searchResults.map((result, idx) => (
              <SearchResultCard key={idx} result={result} />
            ))}
          </div>
        </div>
      )}

      {/* Thinking Process Loading State */}
      {section.isLoadingThinking && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="pl-4 border-l-2 border-gray-300">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        </div>
      )}

      {/* Thinking Process */}
      {section.reasoning && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <ThinkingIcon />
              <h3 className="text-sm font-semibold text-gray-600">
                Thinking Process:
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onViewReasoningInput}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Full Input</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button
                onClick={onToggleReasoning}
                className="text-gray-600 hover:text-gray-700"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    section.isReasoningCollapsed ? "-rotate-90" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
          <motion.div
            className="pl-4 border-l-2 border-gray-300"
            initial={false}
            animate={{
              height: section.isReasoningCollapsed ? 0 : "auto",
              opacity: section.isReasoningCollapsed ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-gray-600 leading-relaxed overflow-hidden">
              {section.reasoning}
            </div>
          </motion.div>
        </div>
      )}

      {/* Final Report */}
      {section.response && (
        <div className="mt-12 mb-16">
          <div className="prose prose-blue max-w-none space-y-4 text-gray-800 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ ...props }) => (
                  <div className="my-8 overflow-x-auto rounded-lg border border-gray-200">
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
                    className="py-3 px-4 font-medium text-sm text-gray-900 border-b border-gray-200"
                    {...props}
                  />
                ),
                td: ({ ...props }) => {
                  const content = props.children?.toString() || "";
                  if (content.match(/\[.*?\]\(.*?\)/)) {
                    return (
                      <td className="py-3 px-4 text-sm text-gray-500">
                        <ReactMarkdown
                          components={{
                            a: ({ ...linkProps }) => (
                              <a
                                {...linkProps}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
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
                      className="py-3 px-4 text-sm text-gray-500"
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
        <div className="text-center text-red-600 mb-8">{section.error}</div>
      )}
    </div>
  );
};

// Import SearchResultCard component
import SearchResultCard from "./SearchResultCard";

export default ResultsDisplay;
