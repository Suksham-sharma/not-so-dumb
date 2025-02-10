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
            <FadeIn className="p-8 bg-white/80 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
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
                    {links.length === 0
                      ? "Time to Build Your Knowledge Base!"
                      : "No Matches Found"}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 text-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {links.length === 0
                      ? "Your Second Brain is ready to grow. Start by adding your favorite articles, videos, or any online resources you want to remember."
                      : "Try adjusting your search terms or filters to find what you're looking for."}
                  </motion.p>
                  {links.length === 0 && (
                    <motion.button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 px-6 py-3 bg-orange-400 text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none inline-flex items-center gap-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Plus size={20} />
                      Add Your First Resource
                    </motion.button>
                  )}
                </div>
              </div>
            </FadeIn>
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
