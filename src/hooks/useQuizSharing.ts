import { toast } from "sonner";
import { useState } from "react";

import { Question } from "@/types/quiz";

interface UseQuizSharingProps {
  quizId?: string;
  quiz: Question[];
}

export const useQuizSharing = ({
  quizId: initialQuizId,
  quiz,
}: UseQuizSharingProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [quizId, setQuizId] = useState<string | undefined>(initialQuizId);

  const saveQuizToBackend = async () => {
    if (!quiz) return null;

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) {
        throw new Error("Failed to save quiz");
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Error saving quiz:", error);
      return null;
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      let currentQuizId = quizId;

      if (!currentQuizId && quiz) {
        currentQuizId = await saveQuizToBackend();
        if (!currentQuizId) {
          throw new Error("Failed to generate share link");
        }
        setQuizId(currentQuizId);
      }

      if (!currentQuizId) {
        throw new Error("No quiz ID available");
      }

      const shareUrl = `${window.location.origin}/quiz/${currentQuizId}`;
      await navigator.clipboard.writeText(shareUrl);

      toast.success("Quiz link copied to clipboard!", {
        position: "top-right",
        duration: 2000,
      });
    } catch (err) {
      toast.error("Failed to share quiz", {
        position: "top-right",
        duration: 2000,
      });
      console.error("Share error:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return {
    handleShare,
    isSharing,
    quizId,
  };
};
