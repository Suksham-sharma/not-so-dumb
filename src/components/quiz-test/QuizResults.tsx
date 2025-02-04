import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "../ui/motion";
import YellowButton from "../ui/yellow-button";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  correctAnswers: number;
  visitedQuestions: number[];
  onRetry?: () => void;
  onReview?: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  timeTaken,
  correctAnswers,
  visitedQuestions,
  onRetry,
  onReview,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  const performanceLevel =
    scorePercentage >= 80
      ? "Excellent!"
      : scorePercentage >= 60
      ? "Good Job!"
      : scorePercentage >= 40
      ? "Keep Practicing!"
      : "Need Improvement";

  const performanceEmoji =
    scorePercentage >= 80
      ? "🎉"
      : scorePercentage >= 60
      ? "👏"
      : scorePercentage >= 40
      ? "💪"
      : "📚";

  return (
    <div className="min-h-screen relative overflow-hidden p-4 md:p-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#80808012_1px,transparent_1px),linear-gradient(-45deg,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute top-0 left-0 w-24 h-24 bg-yellow-300 border-2 border-black transform -rotate-12 -translate-x-6 -translate-y-6" />
      <div className="absolute bottom-0 right-0 w-28 h-28 bg-blue-300 border-2 border-black transform rotate-12 translate-x-6 translate-y-6" />
      <div className="absolute bottom-1/4 left-0 w-16 h-16 bg-orange-300 border-2 border-black transform rotate-6 -translate-x-3" />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        {/* Left Section - Performance Overview */}
        <div className="relative p-8">
          <FadeIn>
            <YellowButton className="relative text-lg mb-8 z-10">
              {performanceEmoji} Quiz Complete!
            </YellowButton>
          </FadeIn>

          <div className="relative bg-white/90 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform  hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-400 border-2 border-black transform rotate-12" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-400 border-2 border-black transform -rotate-12" />

            <h1 className="text-5xl font-black mb-4 leading-tight relative z-10">
              <span className="relative inline-block">
                {performanceLevel}
                <div className="absolute bottom-2 left-0 w-full h-4 bg-yellow-300 -z-10 transform -rotate-2" />
              </span>
            </h1>
            <p className="text-lg text-gray-700 relative z-10 mb-6">
              Here&apos;s how you performed in this quiz!
            </p>

            <div className="grid grid-cols-1 gap-6">
              {/* Score Card */}
              <div className="bg-green-100 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="w-3 h-8 bg-green-400 border-2 border-black mr-4" />
                  Score
                </h2>
                <div className="flex items-end justify-between">
                  <div className="text-5xl font-black">{scorePercentage}%</div>
                  <div className="text-gray-600 text-lg">
                    {correctAnswers}/{totalQuestions} correct
                  </div>
                </div>
              </div>

              {/* Time Card */}
              <div className="bg-blue-100 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="w-3 h-8 bg-blue-400 border-2 border-black mr-4" />
                  Time Taken
                </h2>
                <div className="flex items-end justify-between">
                  <div className="text-5xl font-black">
                    {formatTime(timeTaken)}
                  </div>
                  <div className="text-gray-600 text-lg">minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Performance Metrics */}
        <div className="relative p-8">
          <div className="bg-white/90 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <span className="w-8 h-8 bg-orange-400 border-2 border-black mr-4 transform rotate-6" />
                Performance Metrics
              </h2>
              <div className="h-2 w-24 bg-yellow-400 border-2 border-black" />
            </div>

            <div className="space-y-8">
              {/* Accuracy Bar */}
              <div className="bg-green-50 p-6 rounded-xl border-2 border-black">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-bold flex items-center gap-2">
                    <span className="w-3 h-6 bg-green-400 border-2 border-black" />
                    Accuracy
                  </span>
                  <span className="text-xl font-black">{scorePercentage}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden border-2 border-black">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scorePercentage}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-green-400 rounded-full"
                  />
                </div>
              </div>

              {/* Questions Attempted */}
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-black">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-bold flex items-center gap-2">
                    <span className="w-3 h-6 bg-blue-400 border-2 border-black" />
                    Questions Attempted
                  </span>
                  <span className="text-xl font-black">
                    {visitedQuestions.length}/{totalQuestions}
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden border-2 border-black">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (visitedQuestions.length / totalQuestions) * 100
                      }%`,
                    }}
                    transition={{ duration: 1 }}
                    className="h-full bg-blue-400 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-12">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 bg-orange-400 text-black font-bold py-3 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-orange-300 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="relative z-10">Try Again</span>
                </button>
              )}
              {onReview && (
                <button
                  onClick={onReview}
                  className="flex-1 bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-yellow-300 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="relative z-10">Review Quiz</span>
                </button>
              )}
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-blue-400 text-black font-bold py-3 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-blue-300 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative z-10">Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
