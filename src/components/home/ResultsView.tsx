"use client";

import { motion } from "framer-motion";
import { ChatSection, Message, TavilyResponse } from "../../types";
import ResultsDisplay from "../ResultsDisplay";

interface ResultsViewProps {
  chatSections: ChatSection[];
  isLoading: boolean;
  messages: Message[];
  setShowTavilyModal: (show: boolean) => void;
  setSelectedMessageData: (data: { tavily?: TavilyResponse }) => void;
}

export default function ResultsView({
  chatSections,
  isLoading,
  messages,
  setShowTavilyModal,
  setSelectedMessageData,
}: ResultsViewProps) {
  // Helper function to create Tavily data structure from search results
  const createTavilyDataFromSearchResults = (
    section: ChatSection
  ): TavilyResponse => {
    return {
      results: section.searchResults,
      query: section.query,
      // Extract images if available
      images: section.searchResults
        .filter((result) => result.image)
        .map((result) => result.image!),
    };
  };

  // Function to handle viewing Tavily data for a specific section
  const handleViewTavilyData = (section: ChatSection) => {
    // Always create Tavily data from section search results
    // This ensures we always have data to show
    const tavilyData = createTavilyDataFromSearchResults(section);

    if (tavilyData && tavilyData.results.length > 0) {
      setSelectedMessageData({ tavily: tavilyData });
      setShowTavilyModal(true);
    } else {
      alert("No search results available to view");
      console.warn("No search results available to view");
    }
  };

  return (
    <motion.div
      className="space-y-4 md:space-y-6 pb-20 md:pb-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {chatSections.map((section, index) => (
        <div
          key={index}
          className="border-2 border-black bg-bg/60 rounded-xl hover:shadow-none mx-2 md:mx-0"
        >
          <ResultsDisplay
            section={section}
            isLoading={isLoading}
            onViewTavilyData={() => handleViewTavilyData(section)}
          />
        </div>
      ))}
    </motion.div>
  );
}
