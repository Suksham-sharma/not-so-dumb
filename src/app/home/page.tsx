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
      if (input) {
        setInput(suggestion.prefix + input);
      }
    },
    [input]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setHasSubmitted(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Check if input contains YouTube URL
    const isYouTubeQuery = containsYouTubeUrl(input);
    let youtubeVideo: YouTubeVideo | undefined = undefined;
    let processedQuery = input;

    if (isYouTubeQuery && !currentYouTubeVideo) {
      const youtubeUrl = extractYouTubeUrl(input);
      if (youtubeUrl) {
        const videoId = extractYouTubeVideoId(youtubeUrl);
        if (videoId) {
          try {
            const fetchedVideo = await fetchYouTubeVideoData(videoId);
            if (fetchedVideo) {
              youtubeVideo = fetchedVideo;
              setCurrentYouTubeVideo(fetchedVideo);
              processedQuery = input.replace(youtubeUrl, "").trim();
              if (!processedQuery) {
                processedQuery = `Analyze this video: ${youtubeVideo.title}`;
              }
            }
          } catch (error) {
            console.error("Failed to fetch YouTube video:", error);
          }
        }
      }
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

    try {
      let reasoningInput = "";

      if (youtubeVideo?.transcript || currentYouTubeVideo?.transcript) {
        const videoForTranscript = youtubeVideo || currentYouTubeVideo;
        reasoningInput = `User is asking about this YouTube video:
Title: ${videoForTranscript!.title}
Description: ${videoForTranscript!.description}
Video URL: ${videoForTranscript!.url}

${
  videoForTranscript!.transcript
    ? `Video Transcript:
${videoForTranscript!.transcript}`
    : "Note: No transcript available for this video."
}

User Question: ${processedQuery}

Please answer the user's question based on the video content and transcript provided.`;

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
      } else {
        // Regular web search for non-YouTube queries or YouTube queries without transcript
        const searchResponse = await fetchTavilyResults(
          processedQuery,
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
          processedQuery,
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
          content: `Query: ${processedQuery}\n\n${webReasoningInput}`,
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
      handleSearchError(error, sectionIndex, setError, setChatSections);
    } finally {
      if (!aiIsLoading) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] relative overflow-hidden">
      <AnimatedBlobs />
      <TopBar />

      <div className="pt-20 md:pt-24 pb-24 relative">
        <div className="absolute inset-0 bg-white/50" />
        <motion.div className="absolute left-1/2 top-1/2 h-[300px] md:h-[500px] w-[300px] md:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-300 to-blue-100/30 blur-3xl" />

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
              />
            ) : currentYouTubeVideo ? (
              <YouTubeChatView
                video={currentYouTubeVideo}
                chatSections={chatSections}
                isLoading={isLoading}
                messages={messages}
                setShowTavilyModal={setShowTavilyModal}
                setSelectedMessageData={setSelectedMessageData}
              />
            ) : (
              <ResultsView
                chatSections={chatSections}
                isLoading={isLoading}
                messages={messages}
                setShowTavilyModal={setShowTavilyModal}
                setSelectedMessageData={setSelectedMessageData}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {hasSubmitted && (
        <div className="fixed bottom-4 md:bottom-6 left-0 right-0 flex justify-center px-4">
          <div className="w-full max-w-[704px]">
            <SearchInput
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              placeholder={
                currentYouTubeVideo
                  ? "Ask about this video..."
                  : "Ask a question..."
              }
            />
          </div>
        </div>
      )}

      {showTavilyModal && (
        <TavilyModal
          selectedMessageData={selectedMessageData}
          onClose={() => setShowTavilyModal(false)}
        />
      )}
    </div>
  );
}
