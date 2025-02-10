"use client";
import React, { memo, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTags } from "@/hooks/useTags";
import { toast } from "sonner";

interface FormValues {
  url: string;
  title: string;
  tags: string[];
}

interface FormSectionProps {
  newLink: FormValues;
  setNewLink: React.Dispatch<React.SetStateAction<FormValues>>;
  isLoading: boolean;
}

const MAX_TAGS = 5;

const FormSectionComponent: React.FC<FormSectionProps> = ({
  newLink,
  setNewLink,
  isLoading,
}) => {
  const { register, watch, setValue } = useForm<FormValues>({
    defaultValues: newLink,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    suggestions,
    addTag,
    fetchSuggestions,
    isLoading: isAddingTag,
  } = useTags();

  useEffect(() => {
    if (showSuggestions) {
      fetchSuggestions("", tags);
    }
  }, [showSuggestions, fetchSuggestions, tags]);

  useEffect(() => {
    const subscription = watch((value) => {
      setNewLink(value as FormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, setNewLink]);

  // Add effect to sync with newLink changes
  useEffect(() => {
    setValue("title", newLink.title);
  }, [newLink.title, setValue]);

  const handleTagInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputTag.trim()) {
      e.preventDefault();

      const newTag = inputTag.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        try {
          const addedTag = await addTag(newTag);
          if (addedTag) {
            const updatedTags = [...tags, newTag];
            setTags(updatedTags);
            setNewLink((prev) => ({ ...prev, tags: updatedTags }));
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to add tag"
          );
        }
      }
      setInputTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setNewLink((prev) => ({ ...prev, tags: updatedTags }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-2">Resource URL</label>
        <input
          type="url"
          {...register("url", {
            required: "URL is required",
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Please enter a valid URL",
            },
          })}
          autoComplete="off"
          className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="https://example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Resource Title</label>
        <input
          type="text"
          {...register("title", {
            required: "Title is required",
          })}
          className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
          placeholder="Give your resource a memorable title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          Knowledge Tags (Max {MAX_TAGS})
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
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
        <div className="relative">
          <input
            type="text"
            value={inputTag}
            onChange={(e) => {
              setInputTag(e.target.value);
              fetchSuggestions(e.target.value, tags);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onKeyDown={handleTagInput}
            className="w-full p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
            placeholder="Add tag"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => {
                    if (!tags.includes(suggestion.name)) {
                      const updatedTags = [...tags, suggestion.name];
                      setTags(updatedTags);
                      setNewLink((prev) => ({ ...prev, tags: updatedTags }));
                    }
                    setInputTag("");
                    setShowSuggestions(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-orange-100 active:bg-orange-200 transition-colors focus:outline-none focus:bg-orange-100 border-b-2 border-black last:border-b-0 font-medium group flex items-center gap-3"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="w-5 h-5 border-2 border-black rounded flex items-center justify-center bg-white group-hover:bg-orange-100 group-active:bg-orange-200 transition-colors">
                    {tags.includes(suggestion.name) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="flex-1">{suggestion.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
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
};

export const FormSection = memo(FormSectionComponent);
