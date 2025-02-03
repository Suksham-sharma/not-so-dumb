"use client";
import React from "react";
import { QuizConfig } from "@/components/quiz-config";

export default function QuizPage() {
  const handleQuizGeneration = async (config: {
    numQuestions: number;
    difficulty: string;
    topic: string;
    transcript?: string[];
    articleContent?: string;
  }) => {
    console.log("Generating quiz with config:", config);
  };

  return (
    <main className="mx-auto p-4 relative">
      <QuizConfig onSubmit={handleQuizGeneration} />
    </main>
  );
}
