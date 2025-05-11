import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface PreviewData {
  title: string;
  description: string;
  image: string | null;
}

export const usePreviewData = (
  url: string,
  onTitleFound?: (title: string) => void
) => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(
    async (url: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`/api/metadata`, {
          params: { url: url },
        });

        setPreview(response.data);
        if (response.data.title && onTitleFound) {
          onTitleFound(response.data.title);
        }
      } catch (error) {
        console.error("Error fetching preview:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch preview"
        );
        setPreview(null);
      } finally {
        setIsLoading(false);
      }
    },
    [onTitleFound]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url) {
        fetchPreview(url);
      } else {
        setPreview(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [url, fetchPreview]);

  return { preview, isLoading, error };
};
