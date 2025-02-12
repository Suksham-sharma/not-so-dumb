"use client";
import React from "react";
import { motion } from "framer-motion";
import { usePreviewData } from "@/hooks/usePreviewData";
import { FormSection } from "./form/FormSection";
import { PreviewSection } from "./form/PreviewSection";
import { useLinksStore } from "@/store/links";
import { toast } from "sonner";
import { toastStyles } from "@/lib/styles";

interface LinkFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const LinkForm: React.FC<LinkFormProps> = ({
  onSubmit,
  isLoading: parentIsLoading,
}) => {
  const { addLink, isLoading: isSaving } = useLinksStore();
  const [formData, setFormData] = React.useState({
    url: "",
    title: "",
    tags: [] as string[],
  });

  const handleTitleFound = (title: string) => {
    if (!formData.title) {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLink({
        url: formData.url,
        title: formData.title,
        tags: formData.tags.filter((tag) => tag !== ""),
        image: preview?.image ?? undefined,
      });
      setFormData({ url: "", title: "", tags: [] });
      onSubmit(e);
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save link",
        {
          className: toastStyles.error,
        }
      );
    }
  };

  const { preview, isLoading: isLoadingPreview } = usePreviewData(
    formData.url,
    handleTitleFound
  );

  React.useEffect(() => {
    if (preview?.title) {
      setFormData((prev) => ({ ...prev, title: preview.title }));
    }
  }, [preview]);

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
            Add to Your Second Brain
            <div className="absolute bottom-0 left-0 w-full h-3 bg-blue-300 -z-10 transform -rotate-1" />
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <FormSection
          newLink={formData}
          setNewLink={setFormData}
          isLoading={parentIsLoading || isSaving}
        />
        <PreviewSection
          preview={preview}
          isLoadingPreview={isLoadingPreview}
          formTitle={formData.title}
        />
      </div>
    </motion.form>
  );
};

export default LinkForm;
