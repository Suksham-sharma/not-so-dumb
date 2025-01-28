"use client";

import React from "react";
import { motion } from "framer-motion";
import QuizConfig from "@/components/QuizConfig";
import TopBar from "@/components/TopBar";

export default function QuizPage() {
  const handleQuizGeneration = (config: {
    numQuestions: number;
    difficulty: string;
    topic: string;
  }) => {
    // TODO: Implement quiz generation logic
    console.log("Generating quiz with config:", config);
  };

  return (
    <div className="min-h-screen bg-orange-200/10 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] relative overflow-hidden">
      <TopBar />
      <div className="pt-14 pb-24 relative">
        <div className="absolute inset-0 " />
        <motion.div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-300 to-blue-100/30 blur-3xl" />
        <main className="mx-auto p-4 relative">
          <QuizConfig onSubmit={handleQuizGeneration} />
        </main>
      </div>
    </div>
  );
}
