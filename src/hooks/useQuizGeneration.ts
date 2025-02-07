import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { extractArticleContent } from "@/services/article";
import { fetchTranscript } from "@/services/youtube";

interface QuizConfig {
  numQuestions: number;
  difficulty: string;
  topic: string;
  sources?: {
    youtubeLink?: string;
    articleLink?: string;
  };
}

export const useQuizGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);

  const MAX_CONTENT_LENGTH = 4000;

  const truncateContent = (content: string) => {
    if (content.length <= MAX_CONTENT_LENGTH) return content;
    return content.slice(0, MAX_CONTENT_LENGTH) + "...";
  };

  const fetchSourceContent = async (config: QuizConfig) => {
    if (!config.sources) return null;

    setIsContentLoading(true);
    try {
      let content = "";
      if (config.sources.youtubeLink) {
        const transcript = await fetchTranscript(config.sources.youtubeLink);
        content = truncateContent(transcript.join(" "));
        toast.success("Successfully fetched YouTube content");
      } else if (config.sources.articleLink) {
        content = truncateContent(
          await extractArticleContent(config.sources.articleLink)
        );
        toast.success("Successfully fetched article content");
      }
      return content;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch content";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsContentLoading(false);
    }
  };

  const generateQuiz = async (config: QuizConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      let sourceContent = null;
      if (config.sources) {
        sourceContent = await fetchSourceContent(config);
      }

      const response = await axios.post("/api/generate-quiz", {
        ...config,
        sourceContent,
      });

      console.log("Response of quiz generation ", response);

      toast.success("Quiz generated successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate quiz";
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateQuiz,
    isLoading,
    error,
  };
};
