"use client";

import React from "react";
import TestScreen from "@/components/quiz-test/TestScreen";
import { useQuizStore } from "@/store/quiz";
import { useSharedQuiz } from "@/hooks/useSharedQuiz";

export default function SharedQuizPage({ params }: { params: { id: string } }) {
  const { isLoading, error } = useSharedQuiz(params.id);

  const handleSubmit = (answers: Record<number, string>) => {
    console.log("Submitted answers:", answers);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-4 md:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#80808012_1px,transparent_1px),linear-gradient(-45deg,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 border-2 border-black transform -rotate-12 -translate-x-8 -translate-y-8" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-300 border-2 border-black transform rotate-12 translate-x-8 translate-y-8" />
        <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-orange-300 border-2 border-black transform rotate-6 -translate-x-4" />

        <div className="relative flex items-center justify-center h-full">
          <div className="relative">
            <div className="w-24 h-24 bg-white border-8 border-black rounded-2xl animate-spin-slow transform rotate-3">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(251,146,60,0.9)_50%,transparent_75%)]" />
            </div>
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 border-2 border-black rounded-lg animate-bounce-gentle" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-300 border-2 border-black rounded-lg animate-bounce-gentle delay-150" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden p-4 md:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#80808012_1px,transparent_1px),linear-gradient(-45deg,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 border-2 border-black transform -rotate-12 -translate-x-8 -translate-y-8" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-300 border-2 border-black transform rotate-12 translate-x-8 translate-y-8" />
        <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-orange-300 border-2 border-black transform rotate-6 -translate-x-4" />

        <div className="relative flex items-center justify-center h-full">
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-8 py-6 rounded-xl relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-400 border-2 border-black transform rotate-12" />
            <strong className="font-bold text-xl">Error: </strong>
            <span className="block sm:inline text-lg mt-2">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TestScreen
      questions={useQuizStore.getState().questions}
      onSubmit={handleSubmit}
      quizId={params.id}
    />
  );
}
