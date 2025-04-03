"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import LinkForm from "./components/LinkForm";
import NotesForm from "./components/NotesForm";
import LinkCard from "./components/ResourceCard";
import SearchFilter from "./components/SearchFilter";
import { BrainChatSheet } from "./components/BrainChatSheet";
import Image from "next/image";
import { FadeIn } from "@/components/ui/motion";
import { useSecondBrain } from "@/hooks/useSecondBrain";
import LinkCardSkeleton from "./components/ResourceSkeleton";
import EmptyState from "./components/EmptyState";
import { Brain, Loader2 } from "lucide-react";

const Header = () => (
  <div className="text-center mt-20 md:mt-0 mb-6 md:mb-16">
    <FadeIn className="hidden md:inline-block px-4 py-1.5 bg-yellow-300 text-black rounded-full text-sm font-bold mb-4 md:mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
      Second Brain
    </FadeIn>
    <FadeIn
      delay={0.1}
      className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 px-2 md:px-4"
    >
      Your Digital Knowledge Hub
    </FadeIn>
    <FadeIn
      delay={0.2}
      className="text-gray-600 text-base md:text-lg hidden md:block"
    >
      Save, organize, and rediscover your valuable online resources!
    </FadeIn>
  </div>
);

const SecondBrain: React.FC = () => {
  const {
    resources,
    isLoadingResources,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    isModalOpen,
    setIsModalOpen,
    isChoiceModalOpen,
    setIsChoiceModalOpen,
    selectedForm,
    setSelectedForm,
    deleteModalOpen,
    setDeleteModalOpen,
    setLinkToDelete,
    handleDeleteClick,
    handleConfirmDelete,
    handleSubmit,
    isDeleting,
    availableTags,
    filteredResources,
    // Brain Chat
    isBrainChatOpen,
    setIsBrainChatOpen,
    brainChatQuery,
    setBrainChatQuery,
    selectedResourceIds,
    setSelectedResourceIds,
    isLoadingBrainChat,
    brainChatResponse,
    handleBrainChat,
  } = useSecondBrain();

  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsChoiceModalOpen(false);
      }
    };

    if (isChoiceModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChoiceModalOpen]);

  return (
    <div className="min-h-screen relative overflow-hidden p-3 md:p-8 bg-gradient-to-br from-orange-50 to-blue-50 pt-4 md:pt-28">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <Header />

        <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-stretch md:items-center mb-4 md:mb-6">
            <div className="flex-1 max-w-2xl w-full">
              <SearchFilter
                onSearchChange={setSearchTerm}
                onTagSelect={setSelectedTag}
                availableTags={availableTags}
                selectedTag={selectedTag}
              />
            </div>
            <button
              onClick={() => setIsBrainChatOpen(true)}
              className="w-full md:w-auto flex-shrink-0 px-4 md:px-6 py-2.5 bg-blue-100 text-black rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2 group"
            >
              <div className="w-4 md:w-5 h-4 md:h-5 relative flex items-center justify-center">
                <Brain className="w-full h-full transition-transform group-hover:scale-110" />
              </div>
              <span className="font-bold whitespace-nowrap text-sm md:text-base">
                Brain Chat
              </span>
            </button>
          </div>

          <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingResources ? (
              [...Array(3)].map((_, index) => <LinkCardSkeleton key={index} />)
            ) : filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <LinkCard
                  key={resource.id}
                  resource={resource}
                  onDeleteClick={handleDeleteClick}
                />
              ))
            ) : (
              <EmptyState
                onAddClick={() => setIsChoiceModalOpen(true)}
                isEmpty={resources.length === 0}
              />
            )}
          </div>
        </div>

        <div className="relative">
          <motion.button
            onClick={() => setIsChoiceModalOpen(true)}
            className="fixed bottom-6 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-yellow-300 text-black rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center z-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/feather.png"
              alt="Add"
              width={32}
              height={32}
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </motion.button>

          {isChoiceModalOpen && (
            <div
              ref={modalRef}
              className="fixed bottom-24 right-4 md:bottom-28 md:right-8 bg-white p-3 md:p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50"
            >
              <div className="flex flex-col gap-2 md:gap-3">
                <button
                  onClick={() => {
                    setSelectedForm("link");
                    setIsChoiceModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 bg-orange-100 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-orange-400 rounded-lg border-2 border-black flex items-center justify-center">
                    <Image
                      src="/globe.svg"
                      alt="Link"
                      width={14}
                      height={14}
                      className="w-4 h-4"
                    />
                  </div>
                  <span className="font-bold text-sm md:text-base">
                    Add Link
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSelectedForm("note");
                    setIsChoiceModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 bg-blue-100 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-400 rounded-lg border-2 border-black flex items-center justify-center">
                    <Image
                      src="/file.svg"
                      alt="Note"
                      width={14}
                      height={14}
                      className="w-4 h-4"
                    />
                  </div>
                  <span className="font-bold text-sm md:text-base">
                    Add Note
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <FadeIn className="w-full max-w-4xl">
              <div className="relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 text-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center z-10"
                >
                  ×
                </button>
                {selectedForm === "link" ? (
                  <LinkForm
                    onSubmit={handleSubmit}
                    isLoading={isLoadingResources}
                  />
                ) : (
                  <NotesForm
                    onSubmit={handleSubmit}
                    isLoading={isLoadingResources}
                  />
                )}
              </div>
            </FadeIn>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <FadeIn className="w-full max-w-md">
              <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this resource? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setLinkToDelete(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-black rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex items-center justify-center px-4 py-2 bg-red-400 text-black rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isDeleting ? "Deleting" : "Delete"}
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        )}

        {/* Brain Chat Sheet */}
        <BrainChatSheet
          isOpen={isBrainChatOpen}
          onClose={() => setIsBrainChatOpen(false)}
          query={brainChatQuery}
          setQuery={setBrainChatQuery}
          selectedResourceIds={selectedResourceIds}
          setSelectedResourceIds={setSelectedResourceIds}
          isLoading={isLoadingBrainChat}
          response={brainChatResponse}
          onSubmit={handleBrainChat}
          resources={resources}
        />
      </div>
    </div>
  );
};

export default SecondBrain;
