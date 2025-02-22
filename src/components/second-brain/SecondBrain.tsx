"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import LinkForm from "./components/LinkForm";
import NotesForm from "./components/NotesForm";
import LinkCard from "./components/LinkCard";
import SearchFilter from "./components/SearchFilter";
import Image from "next/image";
import { FadeIn } from "@/components/ui/motion";
import { useLinksStore } from "@/store/links";
import LinkCardSkeleton from "./components/LinkCardSkeleton";
import { toast } from "sonner";
import { toastStyles } from "@/lib/styles";

type FormType = "link" | "note" | null;

const Header = () => (
  <div className="text-center mb-16">
    <FadeIn className="inline-block px-4 py-1.5 bg-yellow-300 text-black rounded-full text-sm font-bold mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
      Second Brain
    </FadeIn>
    <FadeIn delay={0.1} className="text-4xl font-bold mb-4">
      Your Digital Knowledge Hub
    </FadeIn>
    <FadeIn delay={0.2} className="text-gray-600 text-lg">
      Save, organize, and rediscover your valuable online resources!
    </FadeIn>
  </div>
);

const EmptyState = ({
  onAddClick,
  isEmpty,
}: {
  onAddClick: () => void;
  isEmpty: boolean;
}) => (
  <FadeIn className="col-span-full p-8 bg-white/80 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
    <div className="flex items-center gap-8">
      <motion.img
        src="/GetStarted.png"
        alt="Get Started Illustration"
        className="w-56 h-56 object-contain flex-shrink-0"
        initial={{ scale: 0.8, opacity: 0, x: -20 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      />
      <div className="flex-1 space-y-4">
        <motion.h3
          className="text-2xl font-bold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {isEmpty ? "Time to Build Your Knowledge Base!" : "No Matches Found"}
        </motion.h3>
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isEmpty
            ? "Your Second Brain is ready to grow. Start by adding your favorite articles, videos, or any online resources you want to remember."
            : "Try adjusting your search terms or filters to find what you're looking for."}
        </motion.p>
        {isEmpty && (
          <motion.button
            onClick={onAddClick}
            className="mt-4 px-6 py-3 bg-orange-400 text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none inline-flex items-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image src="/feather.png" alt="Add" width={20} height={20} />
            Add Your First Resource
          </motion.button>
        )}
      </div>
    </div>
  </FadeIn>
);

const SecondBrain: React.FC = () => {
  const {
    links,
    isLoading: isLoadingLinks,
    error: linksError,
    fetchLinks,
    deleteLink,
  } = useLinksStore();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = React.useState(false);
  const [selectedForm, setSelectedForm] = React.useState<FormType>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [linkToDelete, setLinkToDelete] = React.useState<string | null>(null);

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

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setLinkToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;
    try {
      await deleteLink(linkToDelete);
      toast.success("Resource deleted successfully", {
        className: toastStyles.success,
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource", {
        className: toastStyles.error,
        duration: 3000,
        position: "bottom-right",
      });
    } finally {
      setDeleteModalOpen(false);
      setLinkToDelete(null);
    }
  };

  const availableTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    links?.forEach((link) => {
      link.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [links]);

  const filteredLinks = React.useMemo(() => {
    return links.filter((link) => {
      const matchesSearch = searchTerm
        ? link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      const matchesTag = selectedTag
        ? link.tags.some((tag) => tag === selectedTag)
        : true;

      return matchesSearch && matchesTag;
    });
  }, [links, searchTerm, selectedTag]);

  return (
    <div className="min-h-screen relative overflow-hidden p-8 bg-gradient-to-br from-orange-50 to-blue-50 pt-4 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        <div className="space-y-6 max-w-5xl mx-auto">
          <SearchFilter
            onSearchChange={setSearchTerm}
            onTagSelect={setSelectedTag}
            availableTags={availableTags}
            selectedTag={selectedTag}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingLinks ? (
              [...Array(3)].map((_, index) => <LinkCardSkeleton key={index} />)
            ) : filteredLinks.length > 0 ? (
              filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDeleteClick={handleDeleteClick}
                />
              ))
            ) : (
              <EmptyState
                onAddClick={() => setIsChoiceModalOpen(true)}
                isEmpty={links.length === 0}
              />
            )}
          </div>
        </div>

        <div className="relative">
          <motion.button
            onClick={() => setIsChoiceModalOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-yellow-300 text-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/feather.png" alt="Add" width={40} height={40} />
          </motion.button>

          {isChoiceModalOpen && (
            <div
              ref={modalRef}
              className="fixed bottom-28 right-8 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50"
            >
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setSelectedForm("link");
                    setIsChoiceModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-2 bg-orange-100 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <div className="w-8 h-8 bg-orange-400 rounded-lg border-2 border-black flex items-center justify-center">
                    <Image src="/globe.svg" alt="Link" width={16} height={16} />
                  </div>
                  <span className="font-bold">Add Link</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedForm("note");
                    setIsChoiceModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-2 bg-blue-100 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <div className="w-8 h-8 bg-blue-400 rounded-lg border-2 border-black flex items-center justify-center">
                    <Image src="/file.svg" alt="Note" width={16} height={16} />
                  </div>
                  <span className="font-bold">Add Note</span>
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
                    isLoading={isLoadingLinks}
                  />
                ) : (
                  <NotesForm
                    onSubmit={handleSubmit}
                    isLoading={isLoadingLinks}
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
                    className="px-4 py-2 bg-red-400 text-black rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondBrain;
