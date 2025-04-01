import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Brain, Tag } from "lucide-react";
import Image from "next/image";

interface BrainChatProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (query: string) => void;
  selectedResourceId: string | null;
  setSelectedResourceId: (id: string | null) => void;
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

export function BrainChat({
  isOpen,
  onClose,
  query,
  setQuery,
  selectedResourceId,
  setSelectedResourceId,
  isLoading,
  response,
  onSubmit,
  resources,
}: BrainChatProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <FadeIn className="w-full max-w-4xl">
        <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-300 rounded-lg border-2 border-black flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">Brain Chat</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-red-400 text-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag size={16} />
                  Select Resource (Optional)
                </label>
                <ScrollArea className="h-32 border-2 border-black rounded-lg p-2">
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedResourceId(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg border-2 border-black transition-all ${
                        !selectedResourceId
                          ? "bg-yellow-300"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      All Resources
                    </button>
                    {resources.map((resource) => (
                      <button
                        key={resource.id || resource.title}
                        onClick={() =>
                          resource.id && setSelectedResourceId(resource.id)
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg border-2 border-black transition-all ${
                          selectedResourceId === resource.id
                            ? "bg-yellow-300"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {resource.title}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Brain size={16} />
                  Ask a Question
                </label>
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuery(e.target.value)
                    }
                    placeholder="What would you like to know?"
                    className="flex-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
                  />
                  <Button
                    onClick={onSubmit}
                    disabled={isLoading || !query.trim()}
                    className="bg-yellow-300 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Ask"
                    )}
                  </Button>
                </div>
              </div>

              {response && (
                <div className="mt-6">
                  <div className="bg-orange-50 rounded-lg border-2 border-black p-4 mb-4">
                    <p className="whitespace-pre-wrap">{response.answer}</p>
                  </div>
                  {response.sources.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Sources:</h4>
                      <div className="space-y-2">
                        {response.sources.map((source, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-5 h-5 bg-orange-200 rounded border-2 border-black flex items-center justify-center flex-shrink-0">
                              {source.type === "link" ? (
                                <Image
                                  src="/globe.svg"
                                  alt="Link"
                                  width={12}
                                  height={12}
                                />
                              ) : (
                                <Image
                                  src="/file.svg"
                                  alt="Note"
                                  width={12}
                                  height={12}
                                />
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
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </motion.div>
  );
}
