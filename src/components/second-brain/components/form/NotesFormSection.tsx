"use client";
import React, { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTags } from "@/hooks/useTags";
import { toast } from "sonner";
import Image from "next/image";
import { toastStyles } from "@/lib/styles";

interface FormValues {
  title: string;
  content: string;
  tags: string[];
}

interface FormSectionProps {
  newNote: FormValues;
  setNewNote: React.Dispatch<React.SetStateAction<FormValues>>;
  isLoading: boolean;
}

const MAX_TAGS = 5;

const FormSectionComponent: React.FC<FormSectionProps> = ({
  newNote,
  setNewNote,
  isLoading,
}) => {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: newNote,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");
  const { addTag, fetchSuggestions, suggestions } = useTags();

  const handleTagInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputTag.trim()) {
      e.preventDefault();
      const newTag = inputTag.trim().toLowerCase();
      
      if (tags.length >= MAX_TAGS) {
        toast.error(`Maximum ${MAX_TAGS} tags allowed`, { className: toastStyles.error });
        return;
      }

      if (!tags.includes(newTag)) {
        try {
          await addTag(newTag);
          const updatedTags = [...tags, newTag];
          setTags(updatedTags);
          setNewNote(prev => ({ ...prev, tags: updatedTags }));
          setInputTag("");
        } catch (error) {
          toast.error("Failed to add tag", { className: toastStyles.error });
        }
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setNewNote(prev => ({ ...prev, tags: updatedTags }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-2">Note Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="Give your note a title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Note Content</label>
        <textarea
          {...register("content", { required: "Content is required" })}
          rows={6}
          className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all resize-none"
          placeholder="Write your note here..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          Knowledge Tags ({tags.length}/{MAX_TAGS})
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-lg bg-orange-200 border-2 border-black"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-black hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={inputTag}
          onChange={e => {
            setInputTag(e.target.value);
            fetchSuggestions(e.target.value, tags);
          }}
          onKeyDown={handleTagInput}
          className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="Add tag and press Enter"
          disabled={tags.length >= MAX_TAGS}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-400 text-black font-bold py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image src="/feather.png" alt="Add" width={28} height={32} />
        Save Note
      </button>
    </div>
  );
};

export const FormSection = memo(FormSectionComponent);