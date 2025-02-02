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
      className="bg-orange-50/90 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-8 h-full"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Quiz Progress</h2>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-2 rounded-lg border-2 border-black">
            <p className="text-xs font-medium text-gray-600">Total</p>
            <p className="text-lg font-bold text-gray-800">{totalQuestions}</p>
          </div>
          <div className="bg-white p-2 rounded-lg border-2 border-black">
            <p className="text-xs font-medium text-gray-600">Answered</p>
            <p className="text-lg font-bold text-gray-800">
              {answeredQuestions}
            </p>
          </div>
        </div>

        <div className="pt-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden border-2 border-black">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-green-400 rounded-full"
            />
          </div>
          <p className="text-xs font-medium mt-1 text-center text-gray-600">
            {progressPercentage}% Complete
          </p>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`
                w-full aspect-square rounded-lg border-2 border-black flex items-center justify-center font-bold text-sm
                transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] duration-200 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
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

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-black bg-orange-200" />
            <span className="text-gray-600">Visited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-black bg-green-400" />
            <span className="text-gray-600">Answered</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizProgress;
