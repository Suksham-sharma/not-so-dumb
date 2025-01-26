"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TopBar from "../../components/TopBar";
import SearchInput from "../../components/SearchInput";
import ResultsDisplay from "../../components/ResultsDisplay";
import {
  Message,
  ChatSection,
  SuggestionType,
  TavilyResponse,
  SearchResult,
} from "../../types";
import axios from "axios";
import AnimatedBlobs from "@/components/AnimatedBlobs";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentReasoning, setCurrentReasoning] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentSearchResults, setCurrentSearchResults] = useState<
    SearchResult[]
  >([]);
  const [showTavilyModal, setShowTavilyModal] = useState(false);
  const [showReasoningModal, setShowReasoningModal] = useState(false);
  const [selectedMessageData, setSelectedMessageData] = useState<{
    tavily?: TavilyResponse;
    reasoning?: string;
  }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [chatSections, setChatSections] = useState<ChatSection[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );

  const handleSuggestionClick = (suggestion: SuggestionType) => {
    setSelectedSuggestion(suggestion.label);
    if (input) {
      setInput(suggestion.prefix + input);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setHasSubmitted(true);
    setLastQuery(input);
    setError(null);
    setCurrentSearchResults([]);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setCurrentReasoning("");

    // Create a new chat section with loading states
    const newSection: ChatSection = {
      query: input,
      searchResults: [],
      reasoning: "",
      response: "",
      error: null,
      isLoadingSources: true,
      isLoadingThinking: false,
    };
    setChatSections((prev) => [...prev, newSection]);
    const sectionIndex = chatSections.length;

    try {
      // Step 1: Search with Tavily
      const searchResponse = await axios.post(
        "/api/tavily",
        {
          query: input,
          includeImages: true,
          includeImageDescriptions: true,
        },
        {
          signal: abortControllerRef.current?.signal,
        }
      );

      const searchData = searchResponse.data;

      if (!searchData.results || searchData.results.length === 0) {
        throw new Error(
          "No relevant search results found. Please try a different query."
        );
      }

      // Combine images with results
      const resultsWithImages = searchData.results.map(
        (result: SearchResult, index: number) => ({
          ...result,
          image: searchData.images?.[index],
        })
      );

      // Update section with search results and start thinking
      setChatSections((prev) => {
        const updated = [...prev];
        updated[sectionIndex] = {
          ...updated[sectionIndex],
          searchResults: resultsWithImages,
          isLoadingSources: false,
          isLoadingThinking: true,
        };
        return updated;
      });

      const searchContext = resultsWithImages
        .map(
          (result: SearchResult, index: number) =>
            `[Source ${index + 1}]: ${result.title}\n${result.content}\nURL: ${
              result.url
            }\n`
        )
        .join("\n\n");

      const tavilyAnswer = searchData.answer
        ? `\nTavily's Direct Answer: ${searchData.answer}\n\n`
        : "";

      const sourcesTable =
        `\n\n## Sources\n| Number | Source | Description |\n|---------|---------|-------------|\n` +
        resultsWithImages
          .map(
            (result: SearchResult, index: number) =>
              `| ${index + 1} | [${result.title}](${result.url}) | ${
                result.snippet || result.content.slice(0, 150)
              }${result.content.length > 150 ? "..." : ""} |`
          )
          .join("\n");

      const reasoningInput = `Here is the research data:${tavilyAnswer}\n${searchContext}\n\nPlease analyze this information and create a detailed report addressing the original query: "${input}". Include citations to the sources where appropriate. If the sources contain any potential biases or conflicting information, please note that in your analysis.\n\nIMPORTANT: Always end your response with a sources table listing all references used. Format it exactly as shown below:\n${sourcesTable}`;

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        reasoning: "",
        searchResults: resultsWithImages,
        fullTavilyData: searchData,
        reasoningInput,
      };

      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            userMessage,
            {
              role: "assistant" as const,
              content:
                "I found some relevant information. Let me analyze it and create a comprehensive report.",
            },
            {
              role: "user" as const,
              content: reasoningInput,
            },
          ],
        }),
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.choices?.[0]?.delta?.reasoning_content) {
              const newReasoning =
                (assistantMessage.reasoning || "") +
                parsed.choices[0].delta.reasoning_content;
              assistantMessage.reasoning = newReasoning;
              setCurrentReasoning(newReasoning);
              setChatSections((prev) => {
                const updated = [...prev];
                updated[sectionIndex] = {
                  ...updated[sectionIndex],
                  reasoning: newReasoning,
                  isLoadingThinking: false,
                };
                return updated;
              });
            } else if (parsed.choices?.[0]?.delta?.content) {
              const newContent =
                (assistantMessage.content || "") +
                parsed.choices[0].delta.content;
              assistantMessage.content = newContent;
              setChatSections((prev) => {
                const updated = [...prev];
                updated[sectionIndex] = {
                  ...updated[sectionIndex],
                  response: newContent,
                };
                return updated;
              });
            }
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
      }

      // Update the section with search results
      setChatSections((prev) => {
        const updated = [...prev];
        updated[sectionIndex] = {
          ...updated[sectionIndex],
          searchResults: resultsWithImages,
        };
        return updated;
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        console.error("Error:", error);
        setError(errorMessage);
        setChatSections((prev) => {
          const updated = [...prev];
          updated[sectionIndex] = {
            ...updated[sectionIndex],
            error: errorMessage,
            isLoadingSources: false,
            isLoadingThinking: false,
          };
          return updated;
        });
      }
    } finally {
      setIsLoading(false);
      setSearchStatus("");
      abortControllerRef.current = null;
    }
  };

  const toggleReasoning = (index: number) => {
    setChatSections((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isReasoningCollapsed: !updated[index].isReasoningCollapsed,
      };
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] relative overflow-hidden">
      <AnimatedBlobs />
      <TopBar />
      <div className="pt-14 pb-24 relative">
        <div className="absolute inset-0 bg-white/50" />
        <motion.div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-300 to-blue-100/30 blur-3xl" />
        <main className=" mx-auto p-4 relative">
          <AnimatePresence mode="wait">
            {!hasSubmitted ? (
              <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block px-4 py-1.5 bg-yellow-300 text-black rounded-full text-sm font-bold mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                  >
                    Powered by Web Enhanced LLM
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed"
                  >
                    Do research for your needs in seconds, so you can spend more
                    time doing what actually matters.
                  </motion.p>
                </div>
                <SearchInput
                  input={input}
                  setInput={setInput}
                  isLoading={isLoading}
                  handleSubmit={handleSubmit}
                  selectedSuggestion={selectedSuggestion}
                  handleSuggestionClick={handleSuggestionClick}
                  showSuggestions={true}
                />
              </div>
            ) : (
              <motion.div
                className="space-y-6 pb-32"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {chatSections.map((section, index) => (
                  <div
                    key={index}
                    className="border-2 border-black bg-bg/60 rounded-xl  hover:shadow-none"
                  >
                    <ResultsDisplay
                      section={section}
                      isLoading={isLoading}
                      onToggleReasoning={() => toggleReasoning(index)}
                      onViewTavilyData={() => {
                        setSelectedMessageData({
                          tavily: messages[messages.length - 1]?.fullTavilyData,
                        });
                        setShowTavilyModal(true);
                      }}
                      onViewReasoningInput={() => {
                        setSelectedMessageData({
                          reasoning:
                            messages[messages.length - 1]?.reasoningInput,
                        });
                        setShowReasoningModal(true);
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Replace the floating input box with SearchInput component */}
      {hasSubmitted && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <SearchInput
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        </div>
      )}

      {showTavilyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border-2 border-black p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading  text-black">
                Full Tavily Response
              </h3>
              <button
                onClick={() => setShowTavilyModal(false)}
                className="text-black hover:text-gray-700 border-2 border-black rounded-lg p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                <svg
                  className="w-6 h-6"
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
            <pre className="whitespace-pre-wrap text-sm text-black font-mono bg-yellow-100 p-4 rounded-lg border-2 border-black">
              {JSON.stringify(selectedMessageData?.tavily, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {showReasoningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border-2 border-black p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading  text-black">
                Full Reasoning Input
              </h3>
              <button
                onClick={() => setShowReasoningModal(false)}
                className="text-black hover:text-gray-700 border-2 border-black rounded-lg p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                <svg
                  className="w-6 h-6"
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
            <pre className="whitespace-pre-wrap text-sm text-black font-mono bg-yellow-100 p-4 rounded-lg border-2 border-black">
              {selectedMessageData?.reasoning}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
