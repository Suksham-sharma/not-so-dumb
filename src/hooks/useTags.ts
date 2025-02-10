"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";

interface Tag {
  id: string;
  name: string;
}

const MAX_USER_TAGS = 5;

export const useTags = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [userTagCount, setUserTagCount] = useState(0);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await axios.get("/api/tags");
        setAllTags(response.data);
        setUserTagCount(response.data.length);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
        setAllTags([]);
        setUserTagCount(0);
      }
    };
    fetchAllTags();
  }, []);

  const addTag = useCallback(
    async (tagName: string) => {
      const existingTag = allTags.find(
        (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
      );
      if (existingTag) {
        return existingTag;
      }

      const currentUserTags = allTags.filter(
        (tag) => tag.name.toLowerCase() !== tagName.toLowerCase()
      );
      if (currentUserTags.length >= MAX_USER_TAGS) {
        const error = `You can only create up to ${MAX_USER_TAGS} unique tags`;
        setError(error);
        throw new Error(error);
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post("/api/tags", { name: tagName });
        setAllTags((prev) => [...prev, response.data]);
        setUserTagCount(currentUserTags.length + 1);
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add tag");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [allTags]
  );

  const fetchSuggestions = useCallback(
    (query: string, selectedTags: string[] = []) => {
      const filteredTags = allTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase()) &&
          !selectedTags.includes(tag.name.toLowerCase())
      );
      setSuggestions(filteredTags);
    },
    [allTags]
  );

  return {
    isLoading,
    error,
    suggestions,
    addTag,
    fetchSuggestions,
  };
};
