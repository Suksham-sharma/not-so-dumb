import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";

import { Question } from "@/types/quiz";

interface UseQuizSharingProps {
  quizId?: string;
  topic: string;
  questions: Question[];
}

export const useQuizSharing = ({
  quizId: initialQuizId,
  topic,
  questions,
}: UseQuizSharingProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [quizId, setQuizId] = useState<string | undefined>(initialQuizId);

  const saveQuizToBackend = async () => {
    if (!questions) return null;

    console.log("Data to save is ", {
      topic,
      questions,
    });

    try {
      const { data } = await axios.post("/api/quiz", {
        topic,
        questions,
      });

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

      if (!currentQuizId && questions) {
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
