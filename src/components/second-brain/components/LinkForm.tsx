"use client";
import React from "react";
import { motion } from "framer-motion";
import { Plus, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { usePreviewData } from "@/hooks/usePreviewData";

interface LinkFormProps {
  onSubmit: (e: React.FormEvent) => void;
  newLink: {
    url: string;
    title: string;
    tags: string;
  };
  setNewLink: React.Dispatch<
    React.SetStateAction<{
      url: string;
      title: string;
      tags: string;
    }>
  >;
  isLoading: boolean;
}

const LinkForm: React.FC<LinkFormProps> = ({
  onSubmit,
  newLink,
  setNewLink,
  isLoading,
}) => {
  const handleTitleFound = (title: string) => {
    if (!newLink.title) {
      setNewLink((prev) => ({ ...prev, title }));
    }
  };

  const { preview, isLoading: isLoadingPreview } = usePreviewData(
    newLink.url,
    handleTitleFound
  );

  const PreviewSection = ({
    preview,
    isLoadingPreview,
  }: {
    preview: any;
    isLoadingPreview: boolean;
  }) => {
    if (isLoadingPreview) {
      return (
        <div className="animate-pulse bg-gray-200 h-[400px] rounded-lg border-2 border-black" />
      );
    }

    if (!preview) {
      return (
        <div className="h-[400px] bg-white/50 rounded-lg border-2 border-black p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-orange-400 border-2 border-black rounded-lg flex items-center justify-center">
            <LinkIcon size={32} />
          </div>
          <h3 className="font-bold text-lg">Preview Your Link</h3>
          <p className="text-gray-600 max-w-sm">
            Enter a URL above to see a preview of the content. We&apos;ll
            automatically fetch the title, description, and image if available.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none h-[400px] flex flex-col">
        <div className="flex-1">
          {preview.image && (
            <div className="relative h-48 mb-4">
              <Image
                src={preview.image}
                alt={preview.title}
                fill
                className="object-cover rounded-lg border-2 border-black"
              />
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-bold text-xl truncate">{preview.title}</h3>
            <p className="text-gray-600 line-clamp-3">{preview.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const FormSection = ({
    newLink,
    setNewLink,
    isLoading,
  }: {
    newLink: LinkFormProps["newLink"];
    setNewLink: LinkFormProps["setNewLink"];
    isLoading: boolean;
  }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-2">Resource URL</label>
        <input
          type="url"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="https://example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Resource Title</label>
        <input
          type="text"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="Give your resource a memorable title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Knowledge Tags</label>
        <input
          type="text"
          value={newLink.tags}
          onChange={(e) => setNewLink({ ...newLink, tags: e.target.value })}
          className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="Add tags for easy retrieval (comma-separated)"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-400 text-black font-bold py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={20} />
        Save to Second Brain
      </button>
    </div>
  );

  return (
    <motion.form
      onSubmit={onSubmit}
      className="bg-gray-50 p-6 md:p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
    >
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 border-2 border-black transform rotate-12" />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400 border-2 border-black transform -rotate-12" />
        <h2 className="text-2xl font-bold relative z-10">
          <span className="relative inline-block px-4">
            Add to Your Second Brain
            <div className="absolute bottom-0 left-0 w-full h-3 bg-blue-300 -z-10 transform -rotate-1" />
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <FormSection
          newLink={newLink}
          setNewLink={setNewLink}
          isLoading={isLoading}
        />
        <PreviewSection preview={preview} isLoadingPreview={isLoadingPreview} />
      </div>
    </motion.form>
  );
};

export default LinkForm;
