import { useState, useEffect } from "react";
import { useQuizStore } from "@/store/quiz";
import axios from "axios";

interface QuizData {
  id: string;
  heading: string;
  topic: string;
  difficulty: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

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
