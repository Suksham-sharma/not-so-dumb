"use client";
import React from "react";
import { motion } from "framer-motion";
import { useResourceStore } from "@/store/resource";
import { FormSection } from "./form/NotesFormSection";
import { PreviewSection } from "./form/NotesPreviewSection";

interface NotesFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const NotesForm: React.FC<NotesFormProps> = ({
  onSubmit,
  isLoading: parentIsLoading,
}) => {
  const { addResource, isLoading: isSaving } = useResourceStore();
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
    tags: [] as string[],
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <motion.form
      onSubmit={handleFormSubmit}
      className="bg-gray-50 p-6 md:p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
    >
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 border-2 border-black transform rotate-12" />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400 border-2 border-black transform -rotate-12" />
        <h2 className="text-2xl font-bold relative z-10">
          <span className="relative inline-block px-4">
            Add Note to Your Second Brain
            <div className="absolute bottom-0 left-0 w-full h-3 bg-blue-300 -z-10 transform -rotate-1" />
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <FormSection
          newNote={formData}
          setNewNote={setFormData}
          isLoading={parentIsLoading || isSaving}
        />
        <PreviewSection
          content={formData.content}
          title={formData.title}
          tags={formData.tags}
        />
      </div>
    </motion.form>
  );
};

export default NotesForm;
