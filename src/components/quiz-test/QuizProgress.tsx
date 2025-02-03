import React from "react";
import { motion } from "framer-motion";

interface QuizProgressProps {
  totalQuestions: number;
  answeredQuestions: number;
  currentQuestion: number;
  visitedQuestions: number[];
  answeredQuestionsArray: number[];
  onQuestionClick: (index: number) => void;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  totalQuestions,
  answeredQuestions,
  currentQuestion,
  visitedQuestions,
  answeredQuestionsArray,
  onQuestionClick,
}) => {
  const progressPercentage = (
    (answeredQuestions / totalQuestions) *
    100
  ).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-orange-50/90 p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sticky top-8 h-full relative"
    >
      {/* Add decorative elements */}
      <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-300 border-2 border-black transform rotate-12" />
      <div className="absolute -bottom-3 -right-3 w-5 h-5 bg-blue-400 border-2 border-black transform -rotate-12" />

      <h2 className="text-xl font-bold mb-4 relative z-10">
        <span className="relative inline-block">
          Quiz Progress
          <div className="absolute bottom-0 left-0 w-full h-2 bg-orange-300 -z-10 transform -rotate-1" />
        </span>
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <p className="text-xs font-medium text-gray-600 mb-0.5">
              Total Questions
            </p>
            <p className="text-xl font-bold text-gray-800">{totalQuestions}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <p className="text-xs font-medium text-gray-600 mb-0.5">Answered</p>
            <p className="text-xl font-bold text-gray-800">
              {answeredQuestions}
            </p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border-2 border-black">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs font-bold text-gray-800">
              {progressPercentage}%
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border-2 border-black">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-green-400 rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`
                w-full aspect-square rounded-lg border-2 border-black flex items-center justify-center font-bold text-sm
                transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] duration-200 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
                ${
                  currentQuestion === index
                    ? "!bg-blue-500 border-blue-700 shadow-blue-700 text-white"
                    : ""
                }
                ${
                  answeredQuestionsArray.includes(index + 1)
                    ? "bg-green-400"
                    : ""
                }
                ${
                  visitedQuestions.includes(index) &&
                  !answeredQuestionsArray.includes(index + 1)
                    ? "bg-orange-200"
                    : ""
                }
                ${!visitedQuestions.includes(index) ? "bg-white" : ""}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 bg-white p-2.5 rounded-lg border-2 border-black">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-black bg-orange-200" />
            <span className="text-xs font-medium text-gray-600">Visited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-black bg-green-400" />
            <span className="text-xs font-medium text-gray-600">Answered</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizProgress;
