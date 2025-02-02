"use client";

import React from "react";
import TestScreen from "@/components/quiz-test/TestScreen";

const dummyQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Michelangelo",
    ],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    id: 4,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
  },
];

export default function TestPage() {
  const handleSubmit = (answers: Record<number, string>) => {
    console.log("Submitted answers:", answers);
    const score = Object.entries(answers).reduce(
      (acc, [questionId, answer]) => {
        const question = dummyQuestions.find(
          (q) => q.id === parseInt(questionId)
        );
        if (question && question.correctAnswer === answer) {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    console.log(`Score: ${score}/${dummyQuestions.length}`);
    alert(`Quiz submitted! Your score: ${score}/${dummyQuestions.length}`);
  };

  return <TestScreen questions={dummyQuestions} onSubmit={handleSubmit} />;
}
