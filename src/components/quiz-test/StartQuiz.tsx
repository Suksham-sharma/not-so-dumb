import React from "react";
import YellowButton from "../ui/yellow-button";
import { Share2 } from "lucide-react";
import { useQuizSharing } from "@/hooks/useQuizSharing";
import { Question, Quiz } from "@/types/quiz";

interface StartQuizProps {
  onStart: () => void;
  topic: string;
  quizId?: string;
  questions: Question[];
}

const StartQuiz: React.FC<StartQuizProps> = ({
  onStart,
  topic,
  quizId,
  questions,
}) => {
  const { handleShare, isSharing } = useQuizSharing({
    quizId,
    topic,
    questions,
  });
  return (
    <div className="min-h-screen relative overflow-hidden p-4 md:p-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#80808012_1px,transparent_1px),linear-gradient(-45deg,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 border-2 border-black transform -rotate-12 -translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-300 border-2 border-black transform rotate-12 translate-x-8 translate-y-8" />
      <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-orange-300 border-2 border-black transform rotate-6 -translate-x-4" />

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center h-full">
        {/* Left Section - Topic Showcase */}
        <div className="relative p-8">
          <div className="flex items-center gap-4 mb-8 z-10">
            <YellowButton className="relative text-lg">
              🎯 Ready to Begin?
            </YellowButton>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-black rounded-full text-sm font-bold border-2 border-black shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              <Share2 size={16} />
              Share Quiz
            </button>
          </div>

          <div className="relative bg-white/90 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-400 border-2 border-black transform rotate-12" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-400 border-2 border-black transform -rotate-12" />

            <h1 className="text-6xl font-black mb-6 leading-tight relative z-10">
              <span className="relative inline-block">
                {topic}
                <div className="absolute bottom-2 left-0 w-full h-4 bg-yellow-300 -z-10 transform -rotate-2" />
              </span>
            </h1>
            <p className="text-xl text-gray-700 relative z-10">
              Get ready to challenge yourself and expand your knowledge!
            </p>
          </div>
        </div>

        {/* Right Section - Instructions */}
        <div className="relative p-8">
          <div className="bg-white/90 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <span className="w-8 h-8 bg-green-400 border-2 border-black mr-4 transform rotate-6" />
                Instructions
              </h2>
              <div className="h-2 w-24 bg-orange-400 border-2 border-black" />
            </div>

            <ul className="space-y-6">
              {[
                "Read each question carefully before answering",
                "Navigate between questions using the progress panel",
                "Your progress will be saved automatically",
                "Answer all questions to submit the quiz",
                "Timer starts as soon as you begin",
              ].map((instruction, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 bg-yellow-300 border-2 border-black flex items-center justify-center font-bold transform group-hover:rotate-12 transition-transform">
                    {index + 1}
                  </span>
                  <span className="text-lg text-gray-800">{instruction}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onStart}
              className="w-full mt-12 bg-orange-400 text-black font-bold py-6 px-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-orange-300 transform translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="relative z-10">Start Quiz →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartQuiz;
