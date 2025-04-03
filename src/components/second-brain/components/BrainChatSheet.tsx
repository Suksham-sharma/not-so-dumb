"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Brain, Tag, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface BrainChatSheetProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (query: string) => void;
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
  onSubmit: () => void;
  resources: Array<{
    id?: string;
    title: string;
    type: string;
    url?: string;
  }>;
}

interface ResourceMentionProps {
  resource: {
    id?: string;
    title: string;
    type: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

interface ChatMessageProps {
  message: string;
  sources?: Array<{
    title: string;
    type: string;
    url?: string;
  }>;
}

function ResourceMention({
  resource,
  isSelected,
  onClick,
}: ResourceMentionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 text-sm hover:bg-orange-100 transition-colors",
        isSelected && "bg-orange-100"
      )}
    >
      <span className="truncate block">{resource.title}</span>
    </button>
  );
}

function ChatMessage({ message, sources }: ChatMessageProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-orange-200 rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-3 h-3" />
          </div>
          <div className="flex-1">
            <p className="whitespace-pre-wrap text-sm">{message}</p>
          </div>
        </div>
      </div>
      {sources && sources.length > 0 && (
        <div className="bg-white rounded-lg border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
            <Tag size={12} className="text-orange-500" />
            Sources
          </h4>
          <div className="space-y-1">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs bg-orange-100 p-1.5 rounded-lg border-2 border-black"
              >
                <div className="w-4 h-4 bg-orange-200 rounded border-2 border-black flex items-center justify-center flex-shrink-0">
                  {source.type === "link" ? (
                    <Image src="/globe.svg" alt="Link" width={10} height={10} />
                  ) : (
                    <Image src="/file.svg" alt="Note" width={10} height={10} />
                  )}
                </div>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {source.title}
                  </a>
                ) : (
                  <span>{source.title}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectedResource({
  resource,
  onRemove,
}: {
  resource: { title: string };
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
      <div className="w-4 h-4 bg-orange-200 rounded border-2 border-black flex items-center justify-center flex-shrink-0">
        <Image src="/file.svg" alt="Note" width={10} height={10} />
      </div>
      <span className="text-xs font-medium truncate max-w-[150px]">
        {resource.title}
      </span>
      <button
        onClick={onRemove}
        className="w-5 h-5 bg-orange-200 rounded border-2 border-black flex items-center justify-center hover:bg-orange-300 transition-colors flex-shrink-0"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}

export function BrainChatSheet({
  isOpen,
  onClose,
  query,
  setQuery,
  selectedResourceIds,
  setSelectedResourceIds,
  isLoading,
  response,
  onSubmit,
  resources,
}: BrainChatSheetProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showMentions) return;

    const filteredResources = resources
      .filter((resource) =>
        resource.title
          .toLowerCase()
          .includes(query.slice(query.lastIndexOf("@") + 1).toLowerCase())
      )
      .slice(0, 5);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setMentionIndex((prev) => (prev + 1) % filteredResources.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setMentionIndex(
          (prev) =>
            (prev - 1 + filteredResources.length) % filteredResources.length
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredResources[mentionIndex]) {
          const resource = filteredResources[mentionIndex];
          const lastAtSymbol = query.lastIndexOf("@");
          const newQuery = query.slice(0, lastAtSymbol) + `@${resource.title} `;
          setQuery(newQuery);
          if (!selectedResourceIds.includes(resource.id || "")) {
            setSelectedResourceIds([...selectedResourceIds, resource.id || ""]);
          }
          setShowMentions(false);
          inputRef.current?.focus();
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowMentions(false);
        break;
    }
  };

  const handleMentionClick = (resource: { id?: string; title: string }) => {
    const lastAtSymbol = query.lastIndexOf("@");
    const newQuery = query.slice(0, lastAtSymbol) + `@${resource.title} `;
    setQuery(newQuery);
    if (!selectedResourceIds.includes(resource.id || "")) {
      setSelectedResourceIds([...selectedResourceIds, resource.id || ""]);
    }
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const removeSelectedResource = (id: string) => {
    setSelectedResourceIds(
      selectedResourceIds.filter((resourceId) => resourceId !== id)
    );
  };

  const selectedResources = resources.filter((r) =>
    selectedResourceIds.includes(r.id || "")
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[500px] p-0 border-l-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between p-4 border-b-2 border-black bg-orange-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-300 rounded-lg border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold">
                  Brain Chat
                </SheetTitle>
                <p className="text-xs text-gray-600">
                  Ask questions about your resources
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {response && (
                <ChatMessage
                  message={response.answer}
                  sources={response.sources}
                />
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t-2 border-black bg-orange-100">
            <div className="flex flex-col gap-2">
              {selectedResources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedResources.map((resource) => (
                    <SelectedResource
                      key={resource.id}
                      resource={resource}
                      onRemove={() => removeSelectedResource(resource.id || "")}
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question or type @ to reference a resource"
                    className="w-full px-4 py-3 text-sm border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all focus:outline-none"
                  />
                  {showMentions && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden w-[80%]">
                      {resources
                        .filter((resource) =>
                          resource.title
                            .toLowerCase()
                            .includes(
                              query
                                .slice(query.lastIndexOf("@") + 1)
                                .toLowerCase()
                            )
                        )
                        .slice(0, 5)
                        .map((resource, index) => (
                          <ResourceMention
                            key={resource.id || resource.title}
                            resource={resource}
                            isSelected={index === mentionIndex}
                            onClick={() => handleMentionClick(resource)}
                          />
                        ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={onSubmit}
                  disabled={isLoading || !query.trim()}
                  className="bg-orange-300 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ask"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
