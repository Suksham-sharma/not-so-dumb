"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import TopBar from "../../components/TopBar";
import AnimatedBlobs from "@/components/AnimatedBlobs";
import SearchInput from "../../components/SearchInput";
import LandingView from "@/components/home/LandingView";
import ResultsView from "@/components/home/ResultsView";
import YouTubeChatView from "@/components/home/YouTubeChatView";
import TavilyModal from "@/components/home/TavilyModal";
import {
  Message,
  ChatSection,
  SuggestionType,
  TavilyResponse,
  YouTubeVideo,
} from "../../types";
import {
  fetchTavilyResults,
  processSearchResults,
  updateSectionWithSearchResults,
  updateSectionWithResponse,
  prepareReasoningInput,
  handleSearchError,
} from "@/lib/searchUtils";
import {
  containsYouTubeUrl,
  extractYouTubeUrl,
  extractYouTubeVideoId,
  fetchYouTubeVideoData,
} from "@/lib/youtubeUtils";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSections, setChatSections] = useState<ChatSection[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [showTavilyModal, setShowTavilyModal] = useState(false);
  const [selectedMessageData, setSelectedMessageData] = useState<{
    tavily?: TavilyResponse;
  }>({});
  const [currentYouTubeVideo, setCurrentYouTubeVideo] = useState<
    YouTubeVideo | undefined
  >(undefined);
  const [detectedTags, setDetectedTags] = useState<string[]>([]);
  const [isYouTubeMode, setIsYouTubeMode] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentSectionIndexRef = useRef<number>(-1);

  const {
    messages: aiMessages,
    input: aiInput,
    handleInputChange,
    handleSubmit: handleAiSubmit,
    append,
    status: aiIsLoading,
  } = useChat({
    api: "/api/openai",
    id: "research-chat",
    maxSteps: 5,
    onFinish: () => {
      setIsLoading(false);
      abortControllerRef.current = null;
    },
  });

  // Handle tag detection
  const handleTagDetected = useCallback((tags: string[]) => {
    setDetectedTags(tags);
    setIsYouTubeMode(tags.includes("youtube"));
  }, []);

  // Track AI message changes and update UI
  useEffect(() => {
    if (currentSectionIndexRef.current >= 0 && aiMessages.length > 0) {
      const latestAssistantMessage = aiMessages
        .filter((msg) => msg.role === "assistant")
        .pop();

      if (latestAssistantMessage?.content) {
        updateSectionWithResponse(
          currentSectionIndexRef.current,
          latestAssistantMessage.content,
          setChatSections
        );

        // Update the messages array as well
        setMessages((prev) => {
          const newMessages = [...prev];
          const assistantMessageIndex = newMessages.findIndex(
            (msg) => msg.role === "assistant" && !msg.content
          );

          if (assistantMessageIndex !== -1) {
            newMessages[assistantMessageIndex] = {
              ...newMessages[assistantMessageIndex],
              content: latestAssistantMessage.content,
            };
          } else {
            newMessages.push({
              role: "assistant",
              content: latestAssistantMessage.content,
              searchResults: [],
              reasoningInput: "",
            });
          }

          return newMessages;
        });
      }
    }
  }, [aiMessages]);

  const handleSuggestionClick = useCallback(
    (suggestion: SuggestionType) => {
      setSelectedSuggestion(suggestion.label);
      if (suggestion.prefix === "@youtube ") {
        setInput(suggestion.prefix + input);
        setDetectedTags(["youtube"]);
        setIsYouTubeMode(true);
      } else if (input) {
        setInput(suggestion.prefix + input);
      }
    },
    [input]
  );

  // Extract query without tags
  const extractQueryFromInput = (inputText: string): string => {
    return inputText.replace(/@\w+\s*/g, "").trim();
  };

  // Check if input is YouTube request
  const isYouTubeRequest = (inputText: string, tags: string[]): boolean => {
    return tags.includes("youtube") || containsYouTubeUrl(inputText);
  };

  // Process YouTube input
  const processYouTubeInput = async (
    inputText: string
  ): Promise<{
    video: YouTubeVideo | null;
    processedQuery: string;
  }> => {
    let video: YouTubeVideo | null = null;
    let processedQuery = extractQueryFromInput(inputText);

    // Check for existing video in input
    if (containsYouTubeUrl(inputText)) {
      const youtubeUrl = extractYouTubeUrl(inputText);
      if (youtubeUrl) {
        const videoId = extractYouTubeVideoId(youtubeUrl);
        if (videoId) {
          try {
            const fetchedVideo = await fetchYouTubeVideoData(videoId);
            if (fetchedVideo) {
              video = fetchedVideo;
              processedQuery = inputText
                .replace(youtubeUrl, "")
                .replace(/@youtube\s*/g, "")
                .trim();
              if (!processedQuery) {
                processedQuery = `Analyze this video: ${fetchedVideo.title}`;
              }
            }
          } catch (error) {
            console.error("Failed to fetch YouTube video:", error);
            throw new Error(
              "Failed to fetch YouTube video data. Please check the URL and try again."
            );
          }
        } else {
          throw new Error(
            "Invalid YouTube URL. Please provide a valid YouTube video URL."
          );
        }
      }
    }

    // If no URL but YouTube tag, use current video or prompt for URL
    if (!video && detectedTags.includes("youtube")) {
      if (currentYouTubeVideo) {
        video = currentYouTubeVideo;
        if (!processedQuery) {
          processedQuery = `Continue analyzing this video: ${currentYouTubeVideo.title}`;
        }
      } else if (!processedQuery.includes("http")) {
        throw new Error(
          "Please provide a YouTube URL when using @youtube tag, or continue with the current video."
        );
      }
    }

    return { video, processedQuery };
  };

  // Enhanced query processing for different tags
  const enhanceQueryWithTags = (query: string, tags: string[]): string => {
    let enhancedQuery = query;

    if (tags.includes("research")) {
      enhancedQuery = `Conduct comprehensive research on: ${query}. Provide detailed analysis with multiple perspectives and credible sources.`;
    } else if (tags.includes("compare")) {
      enhancedQuery = `Compare and contrast: ${query}. Analyze similarities, differences, pros and cons with detailed explanations.`;
    }

    return enhancedQuery;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setHasSubmitted(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const isYouTubeReq = isYouTubeRequest(input, detectedTags);
      let youtubeVideo: YouTubeVideo | null = null;
      let processedQuery = input;

      if (isYouTubeReq) {
        const result = await processYouTubeInput(input);
        youtubeVideo = result.video;
        processedQuery = result.processedQuery;

        if (youtubeVideo) {
          setCurrentYouTubeVideo(youtubeVideo);
          setIsYouTubeMode(true);
        }
      } else {
        processedQuery = extractQueryFromInput(input);
      }

      const userMessage = {
        role: "user" as const,
        content: processedQuery,
        youtubeData: youtubeVideo || currentYouTubeVideo,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      const newSection: ChatSection = {
        query: processedQuery,
        searchResults: [],
        response: "",
        error: null,
        isLoadingSources: true,
        youtubeVideo: youtubeVideo || currentYouTubeVideo || undefined,
      };

      setChatSections((prev) => [...prev, newSection]);
      const sectionIndex = chatSections.length;
      currentSectionIndexRef.current = sectionIndex;

      let reasoningInput = "";

      if (youtubeVideo?.transcript || currentYouTubeVideo?.transcript) {
        const videoForTranscript = youtubeVideo || currentYouTubeVideo;
        reasoningInput = `User is asking about this YouTube video:\nTitle: ${
          videoForTranscript!.title
        }\nDescription: ${videoForTranscript!.description}\nVideo URL: ${
          videoForTranscript!.url
        }\n\n${
          videoForTranscript!.transcript
            ? `Video Transcript:\n${videoForTranscript!.transcript}`
            : "Note: No transcript available for this video."
        }\n\nUser Question: ${processedQuery}\n\nPlease answer the user's question based on the video content and transcript provided.`;

        const assistantMessage: Message = {
          role: "assistant",
          content: "",
          reasoning: "",
          searchResults: [],
          youtubeData: videoForTranscript,
          reasoningInput,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        append({
          role: "user",
          content: reasoningInput,
        });

        setChatSections((prev) => {
          const updated = [...prev];
          if (updated[sectionIndex]) {
            updated[sectionIndex] = {
              ...updated[sectionIndex],
              isLoadingSources: false,
              isLoadingThinking: false,
            };
          }
          return updated;
        });
      } else if (youtubeVideo || (currentYouTubeVideo && isYouTubeReq)) {
        // YouTube video present but no transcript
        const videoForGeneral = youtubeVideo || currentYouTubeVideo;
        reasoningInput = `User is asking about this YouTube video:\nTitle: ${
          videoForGeneral!.title
        }\nDescription: ${videoForGeneral!.description}\nVideo URL: ${
          videoForGeneral!.url
        }\n\nNote: No transcript available for this video.\n\nUser Question: ${processedQuery}\n\nPlease answer the user's question based on the video metadata and general knowledge, as no transcript is available.`;

        const assistantMessage: Message = {
          role: "assistant",
          content: "",
          reasoning: "",
          searchResults: [],
          youtubeData: videoForGeneral,
          reasoningInput,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        append({
          role: "user",
          content: reasoningInput,
        });

        setChatSections((prev) => {
          const updated = [...prev];
          if (updated[sectionIndex]) {
            updated[sectionIndex] = {
              ...updated[sectionIndex],
              isLoadingSources: false,
              isLoadingThinking: false,
              error: null,
            };
          }
          return updated;
        });
      } else {
        // Regular web search for non-YouTube queries
        const enhancedQuery = enhanceQueryWithTags(
          processedQuery,
          detectedTags
        );
        const searchResponse = await fetchTavilyResults(
          enhancedQuery,
          abortControllerRef.current
        );
        const searchData = searchResponse.data;

        if (!searchData.results || searchData.results.length === 0) {
          throw new Error(
            "No relevant search results found. Please try a different query."
          );
        }

        const resultsWithImages = processSearchResults(searchData);
        updateSectionWithSearchResults(
          sectionIndex,
          resultsWithImages,
          setChatSections
        );

        const { reasoningInput: webReasoningInput } = prepareReasoningInput(
          enhancedQuery,
          resultsWithImages,
          searchData
        );

        const assistantMessage: Message = {
          role: "assistant",
          content: "",
          reasoning: "",
          searchResults: resultsWithImages,
          fullTavilyData: searchData,
          reasoningInput: webReasoningInput,
          youtubeData: youtubeVideo || currentYouTubeVideo,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        append({
          role: "user",
          content: `Query: ${enhancedQuery}\n\n${webReasoningInput}`,
        });

        setChatSections((prev) => {
          const updated = [...prev];
          if (updated[sectionIndex]) {
            updated[sectionIndex] = {
              ...updated[sectionIndex],
              searchResults: resultsWithImages,
              isLoadingSources: false,
              isLoadingThinking: false,
            };
          }
          return updated;
        });
      }
    } catch (error: unknown) {
      handleSearchError(
        error,
        currentSectionIndexRef.current,
        setError,
        setChatSections
      );
    } finally {
      if (!aiIsLoading) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  // Clear YouTube mode when switching to regular mode
  const handleClearYouTube = () => {
    setCurrentYouTubeVideo(undefined);
    setIsYouTubeMode(false);
    setDetectedTags([]);
  };

  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px] relative overflow-hidden">
      <AnimatedBlobs />
      <TopBar />

      <div className="pt-20 md:pt-24 pb-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80" />

        {/* Enhanced background blobs */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[400px] md:h-[600px] w-[400px] md:w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-200/40 to-blue-200/40 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute left-1/4 top-1/4 h-[200px] md:h-[300px] w-[200px] md:w-[300px] rounded-full bg-gradient-to-r from-yellow-200/30 to-orange-200/30 blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <main className="mx-auto py-4 px-2 md:px-6 relative max-w-8xl">
          <AnimatePresence mode="wait">
            {!hasSubmitted ? (
              <LandingView
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                selectedSuggestion={selectedSuggestion}
                handleSuggestionClick={handleSuggestionClick}
                onTagDetected={handleTagDetected}
              />
            ) : currentYouTubeVideo ? (
              <motion.div
                key="youtube-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <YouTubeChatView
                  video={currentYouTubeVideo}
                  chatSections={chatSections}
                  isLoading={isLoading}
                  messages={messages}
                  setShowTavilyModal={setShowTavilyModal}
                  setSelectedMessageData={setSelectedMessageData}
                  onQuickAction={(action) => {
                    setInput(action);
                    handleSubmit(new Event("submit") as any);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="results-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ResultsView
                  chatSections={chatSections}
                  isLoading={isLoading}
                  messages={messages}
                  setShowTavilyModal={setShowTavilyModal}
                  setSelectedMessageData={setSelectedMessageData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 md:bottom-6 left-0 right-0 flex justify-center px-4 z-50"
        >
          <div className="w-full max-w-[704px] backdrop-blur-sm bg-white/80 rounded-xl p-3 border border-black/10 shadow-lg">
            <SearchInput
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              onTagDetected={handleTagDetected}
              showQuickTags={false}
              placeholder={
                currentYouTubeVideo
                  ? "Ask about this video..."
                  : isYouTubeMode
                  ? "Paste YouTube URL or ask about video..."
                  : "Ask a question..."
              }
            />
          </div>
        </motion.div>
      )}

      {showTavilyModal && (
        <TavilyModal
          selectedMessageData={selectedMessageData}
          onClose={() => setShowTavilyModal(false)}
        />
      )}

      {/* Error display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 border-2 border-red-400 text-red-800 px-6 py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(239,68,68,0.4)] max-w-md z-50"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  );
}
