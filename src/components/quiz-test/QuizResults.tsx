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
}

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  timeTaken,
  correctAnswers,
  visitedQuestions,
  onRetry,
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
      {/* Grid Background */}
      <div className="absolute inset-0 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]" />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative max-w-4xl mx-auto">
        <FadeIn>
          <YellowButton className="relative text-lg mb-8">
            {performanceEmoji} Quiz Complete!
          </YellowButton>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{performanceLevel}</h1>
            <p className="text-gray-600 text-lg">
              Here&apos;s how you performed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Score Card */}
            <div className="bg-green-100 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-bold mb-4">Score</h2>
              <div className="flex items-end justify-between">
                <div className="text-5xl font-bold">{scorePercentage}%</div>
                <div className="text-gray-600">
                  {correctAnswers}/{totalQuestions} correct
                </div>
              </div>
            </div>

            {/* Time Card */}
            <div className="bg-blue-100 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-bold mb-4">Time Taken</h2>
              <div className="flex items-end justify-between">
                <div className="text-5xl font-bold">
                  {formatTime(timeTaken)}
                </div>
                <div className="text-gray-600">minutes</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-orange-50 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
            <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              {/* Accuracy Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-bold">{scorePercentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden border-2 border-black">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scorePercentage}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-green-400 rounded-full"
                  />
                </div>
              </div>

              {/* Questions Attempted */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Questions Attempted</span>
                  <span className="font-bold">
                    {visitedQuestions.length}/{totalQuestions}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden border-2 border-black">
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-orange-400 text-black font-bold py-3 px-8 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-400 text-black font-bold py-3 px-8 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResults;
