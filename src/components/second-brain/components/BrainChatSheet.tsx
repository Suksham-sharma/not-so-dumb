"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Brain, Tag, MessageSquare, X, Send } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    title: string;
    type: string;
    url?: string;
  }>;
}

interface BrainChatSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResourceIds: string[];
  setSelectedResourceIds: (ids: string[]) => void;
  isLoading: boolean;
  response: {
    answer: string;
    sources: Array<{
      title: string;
      type: string;
      url?: string;
    }>;
  } | null;
  onSubmit: (query: string) => void;
  resources: Array<{
    id?: string;
    title: string;
    type: string;
    url?: string;
  }>;
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div
      className={cn(
        "flex gap-3 w-full",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          message.role === "user" ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black",
            message.role === "user" ? "bg-orange-300 text-black" : "bg-white"
          )}
        >
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-orange-100 px-2 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <div className="w-3 h-3 bg-orange-200 rounded-full border-2 border-black flex items-center justify-center">
                  {source.type === "link" ? (
                    <Image src="/globe.svg" alt="Link" width={8} height={8} />
                  ) : (
                    <Image src="/file.svg" alt="Note" width={8} height={8} />
                  )}
                </div>
                <span className="truncate max-w-[150px]">{source.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BrainChatSheet({
  isOpen,
  onClose,
  selectedResourceIds,
  setSelectedResourceIds,
  isLoading,
  response,
  onSubmit,
  resources,
}: BrainChatSheetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (response) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          sources: response.sources,
        },
      ]);
    }
  }, [response]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    onSubmit(input);
    setInput("");
    setShowMentions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentions) {
      const filteredResources = resources
        .filter((resource) =>
          resource.title
            .toLowerCase()
            .includes(input.slice(input.lastIndexOf("@") + 1).toLowerCase())
        )
        .slice(0, 5);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setMentionIndex((prev) =>
            prev < filteredResources.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setMentionIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredResources[mentionIndex]) {
            const lastAtSymbol = input.lastIndexOf("@");
            const newInput =
              input.slice(0, lastAtSymbol) +
              `@${filteredResources[mentionIndex].title} `;
            setInput(newInput);
            if (
              !selectedResourceIds.includes(
                filteredResources[mentionIndex].id || ""
              )
            ) {
              setSelectedResourceIds([
                ...selectedResourceIds,
                filteredResources[mentionIndex].id || "",
              ]);
            }
            setShowMentions(false);
            inputRef.current?.focus();
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowMentions(false);
          break;
        default:
          break;
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const lastAtSymbol = value.lastIndexOf("@");
    if (lastAtSymbol !== -1) {
      const searchTerm = value.slice(lastAtSymbol + 1).toLowerCase();
      const filteredResources = resources.filter((resource) =>
        resource.title.toLowerCase().includes(searchTerm)
      );

      if (filteredResources.length > 0) {
        setShowMentions(true);
        setMentionIndex(0);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const handleResourceSelect = (resource: {
    id?: string;
    title: string;
    type: string;
    url?: string;
  }) => {
    const lastAtSymbol = input.lastIndexOf("@");
    const newInput = input.slice(0, lastAtSymbol) + `@${resource.title} `;
    setInput(newInput);
    if (!selectedResourceIds.includes(resource.id || "")) {
      setSelectedResourceIds([...selectedResourceIds, resource.id || ""]);
    }
    setShowMentions(false);
    inputRef.current?.focus();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[500px] p-0 border-l-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
          {messages.length === 0 && (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#80808012_1px,transparent_1px),linear-gradient(-45deg,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 border-2 border-black transform rotate-12 translate-x-8 -translate-y-8" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300 border-2 border-black transform -rotate-12 -translate-x-8 translate-y-8" />
            </>
          )}

          <SheetHeader className="flex flex-row items-center justify-between p-4 border-b-2 border-black bg-orange-100 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-300 rounded-lg border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start ml-1">
                <SheetTitle className="text-lg sm:text-xl font-bold">
                  Brain Chat
                </SheetTitle>
                <p className="text-xs text-gray-600">
                  The AI assistant that you need
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-orange-300 rounded-lg border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </SheetHeader>

          <ScrollArea className="flex-1 p-4 relative z-10">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-orange-100 rounded-xl border-2 border-black flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">Start a Conversation</h3>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Ask questions about your resources or type @ to reference
                    specific items
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-orange-300 rounded-full border-2 border-black" />
                  <div className="w-2 h-2 bg-yellow-300 rounded-full border-2 border-black" />
                  <div className="w-2 h-2 bg-blue-300 rounded-full border-2 border-black" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-orange-200 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-orange-300 rounded-full border-2 border-black animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-yellow-300 rounded-full border-2 border-black animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-blue-300 rounded-full border-2 border-black animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t-2 border-black bg-orange-100 relative z-10">
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything or type @ to reference a resource..."
                  className="w-full px-4 py-3 text-sm border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all focus:outline-none placeholder:text-gray-500"
                />
                {showMentions && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
                    {resources
                      .filter((resource) =>
                        resource.title
                          .toLowerCase()
                          .includes(
                            input
                              .slice(input.lastIndexOf("@") + 1)
                              .toLowerCase()
                          )
                      )
                      .slice(0, 5)
                      .map((resource, index) => (
                        <button
                          key={resource.id || resource.title}
                          onClick={() => handleResourceSelect(resource)}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm hover:bg-orange-100 transition-colors",
                            index === mentionIndex && "bg-orange-100"
                          )}
                        >
                          <span className="truncate block">
                            {resource.title}
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="bg-orange-300 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
