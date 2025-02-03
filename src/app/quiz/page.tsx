"use client";
import React from "react";
import { QuizConfig } from "@/components/quiz-config";
import { useQuizGeneration } from "@/hooks/useQuizGeneration";

export default function QuizPage() {
  const [quizQuestions, setQuizQuestions] = React.useState(null);
  const { generateQuiz, isLoading, error } = useQuizGeneration();

  const handleQuizGeneration = async (config: {
    numQuestions: number;
    difficulty: string;
    topic: string;
    sources?: {
      youtubeLink?: string;
      articleLink?: string;
    };
  }) => {
    const questions = await generateQuiz(config);
    console.log("Questions", questions);
    if (questions.length > 0) {
      setQuizQuestions(questions);
    }
  };

  const handleQuizSubmit = (answers: Record<number, string>) => {
    console.log("Quiz submitted with answers:", answers);
  };

  return (
    <main className="mx-auto p-4 relative">
      <QuizConfig onSubmit={handleQuizGeneration} isLoading={isLoading} />
    </main>
  );
}
