"use client";

import React from "react";
import TestScreen from "./TestScreen";
import { useQuizStore } from "@/store/quiz";
import { useSharedQuiz } from "@/hooks/useSharedQuiz";

interface SharedQuizContainerProps {
  id: string;
}

const BackgroundLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen relative overflow-hidden p-4 md:p-8 flex items-center justify-center">
    <div className="absolute inset-0 bg-[linear-gradient(45deg,#80808012_1px,transparent_1px),linear-gradient(-45deg,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
    <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 border-2 border-black transform -rotate-12 -translate-x-8 -translate-y-8" />
    <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-300 border-2 border-black transform rotate-12 translate-x-8 translate-y-8" />
    <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-orange-300 border-2 border-black transform rotate-6 -translate-x-4" />
    {children}
  </div>
);

const LoadingState = () => (
  <div className="relative bg-white/90 p-12 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-300 border-2 border-black transform rotate-12" />
    <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-300 border-2 border-black transform -rotate-12" />
    <p className="text-lg font-bold text-center">Loading Quiz...</p>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => {
  const errorMessage = error.includes("404")
    ? "Quiz not found. The quiz you're looking for might have been deleted or never existed."
    : error;

  return (
    <div className="bg-red-100 border-2 border-red-400 text-red-700 px-8 py-6 rounded-xl relative">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-400 border-2 border-black transform rotate-12" />
      <strong className="font-bold text-xl">Error: </strong>
      <span className="block sm:inline text-lg mt-2">{errorMessage}</span>
    </div>
  );
};

const SharedQuizContainer: React.FC<SharedQuizContainerProps> = ({ id }) => {
  const { isLoading, error } = useSharedQuiz(id);

  const handleSubmit = (answers: Record<number, string>) => {
    console.log("Submitted answers:", answers);
  };

  if (isLoading) {
    return (
      <BackgroundLayout>
        <LoadingState />
      </BackgroundLayout>
    );
  }

  if (error) {
    return (
      <BackgroundLayout>
        <ErrorState error={error} />
      </BackgroundLayout>
    );
  }

  return (
    <TestScreen
      questions={useQuizStore.getState().questions}
      onSubmit={handleSubmit}
      quizId={id}
    />
  );
};

export default SharedQuizContainer;
