"use client";

import React from "react";
import TestScreen from "@/components/quiz-test/TestScreen";
import { useQuizStore } from "@/store/quiz";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const { questions, heading } = useQuizStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!questions || questions.length === 0) {
      router.push("/quiz");
    }
  }, [questions, router]);

  const handleSubmit = (answers: Record<number, string>) => {
    console.log("Submitted answers:", answers);
    const score = Object.entries(answers).reduce(
      (acc, [questionId, answer]) => {
        const question = questions.find((q) => q.id === parseInt(questionId));
        if (question && question.correctAnswer === answer) {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    console.log(`Score: ${score}/${questions.length}`);
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return <TestScreen questions={questions} onSubmit={handleSubmit} />;
}
