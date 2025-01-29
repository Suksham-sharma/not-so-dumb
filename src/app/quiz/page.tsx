"use client";

import React from "react";
import QuizConfig from "@/components/QuizConfig";
import TopBar from "@/components/TopBar";
import { fetchTranscript } from "@/lib/youtube";
import { GradientBlob } from "@/components/ui/motion";

export default function QuizPage() {
  const handleQuizGeneration = async (config: {
    numQuestions: number;
    difficulty: string;
    topic: string;
    sources?: {
      youtubeLink: string;
      article: string;
    };
  }) => {
    try {
      if (config.sources?.youtubeLink) {
        const transcript = await fetchTranscript(config.sources.youtubeLink);
        console.log("Transcript fetched:", transcript);
        // TODO: Use transcript to generate quiz questions
      }
      console.log("Generating quiz with config:", config);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  return (
    <div className="min-h-screen bg-orange-200/10 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] relative overflow-hidden">
      <TopBar />
      <div className="pt-14 pb-24 relative">
        <div className="absolute inset-0" />
        <main className="mx-auto p-4 relative">
          <QuizConfig onSubmit={handleQuizGeneration} />
        </main>
      </div>
    </div>
  );
}
