"use client";

import { TavilyResponse } from "../../types";

interface TavilyModalProps {
  selectedMessageData: { tavily?: TavilyResponse };
  onClose: () => void;
}

export default function TavilyModal({
  selectedMessageData,
  onClose,
}: TavilyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border-2 border-black p-4 md:p-6 max-w-2xl w-full max-h-[90vh] md:max-h-[80vh] overflow-y-auto shadow-neo">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-heading text-black">
            Full Tavily Response
          </h3>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700 border-2 border-black rounded-lg p-1.5 md:p-2 shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-xs md:text-sm text-black font-mono bg-yellow-100 p-3 md:p-4 rounded-lg border-2 border-black overflow-x-auto">
          {JSON.stringify(selectedMessageData?.tavily, null, 2)}
        </pre>
      </div>
    </div>
  );
}
