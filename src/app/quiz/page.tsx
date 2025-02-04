"use client";
import React from "react";
import { QuizConfig } from "@/components/quiz-config";
import { useQuizGeneration } from "@/hooks/useQuizGeneration";
import { useQuizStore } from "@/store/quiz";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const { generateQuiz, isLoading, error } = useQuizGeneration();
  const { setQuestions, setHeading } = useQuizStore();

  const handleQuizGeneration = async (config: {
    numQuestions: number;
    difficulty: string;
    topic: string;
    sources?: {
      youtubeLink?: string;
      articleLink?: string;
    };
  }) => {
    const { questions, heading } = await generateQuiz(config);
    if (questions.length > 0) {
      setQuestions(questions);
      setHeading(heading);
      router.push("/quiz/test");
    }
  };

  return (
    <main className="mx-auto p-4 relative">
      <QuizConfig onSubmit={handleQuizGeneration} isLoading={isLoading} />
    </main>
  );
}
