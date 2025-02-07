import { useState, useEffect } from "react";
import { useQuizStore } from "@/store/quiz";
import axios from "axios";

import { Quiz } from "@/types/quiz";

type QuizData = Required<
  Pick<Quiz, "id" | "heading" | "topic" | "difficulty" | "questions">
>;

export const useSharedQuiz = (quizId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setQuestions, setHeading } = useQuizStore();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get<QuizData>(`/api/quiz?id=${quizId}`);
        setQuestions(data.questions);
        setHeading(data.heading);
        setIsLoading(false);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : "Failed to load quiz"
        );
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, setQuestions, setHeading]);

  return { isLoading, error };
};
