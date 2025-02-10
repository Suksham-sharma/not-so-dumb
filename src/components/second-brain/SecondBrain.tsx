"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import LinkForm from "./components/LinkForm";
import LinkCard from "./components/LinkCard";
import SearchFilter from "./components/SearchFilter";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { useLinksStore } from "@/store/links";

const SecondBrain: React.FC = () => {
  const {
    links,
    isLoading: isLoadingLinks,
    error: linksError,
    fetchLinks,
  } = useLinksStore();

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const availableTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    links.forEach((link) => {
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

      const matchesTag = selectedTag ? link.tags.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [links, searchTerm, selectedTag]);

  return (
    <div className="min-h-screen relative overflow-hidden p-8 bg-gradient-to-br from-orange-50 to-blue-50 pt-4 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="space-y-6 max-w-5xl mx-auto">
          <SearchFilter
            onSearchChange={setSearchTerm}
            onTagSelect={setSelectedTag}
            availableTags={availableTags}
            selectedTag={selectedTag}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
          {filteredLinks.length === 0 && (
            <div className="text-center p-12 text-gray-500 bg-white/80 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              {links.length === 0
                ? "Your Second Brain is empty. Start by adding your first resource!"
                : "No matching resources found."}
            </div>
          )}
        </div>

        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-orange-400 text-black rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={24} />
        </motion.button>

        {/* Modal Overlay */}
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
                <LinkForm onSubmit={handleSubmit} isLoading={isLoadingLinks} />
              </div>
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondBrain;
