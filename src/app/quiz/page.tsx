"use client";
import React from "react";
import TopBar from "@/components/TopBar";
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
    <div className="min-h-screen bg-orange-200/10 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] relative overflow-hidden">
      <TopBar />
      <div className="pt-14 pb-4 relative">
        <div className="absolute inset-0" />
        <main className="mx-auto p-4 relative">
          <QuizConfig onSubmit={handleQuizGeneration} />
        </main>
      </div>
    </div>
  );
}
