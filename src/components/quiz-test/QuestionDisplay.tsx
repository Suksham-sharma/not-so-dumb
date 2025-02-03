import React from "react";
import { motion } from "framer-motion";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: string;
}

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: string;
  onOptionSelect: (questionId: number, option: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onOptionSelect,
}) => {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
    >
      {/* Add decorative elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 border-2 border-black transform rotate-12" />
      <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400 border-2 border-black transform -rotate-12" />

      <h3 className="text-2xl font-bold mb-6 relative z-10">
        <span className="relative inline-block">
          Question {questionNumber}
          <div className="absolute bottom-0 left-0 w-full h-3 bg-yellow-300 -z-10 transform -rotate-1" />
        </span>
      </h3>
      <p className="text-xl mb-8">{question.question}</p>

      <div className="space-y-4">
        {question.options.map((option, optionIndex) => (
          <label
            key={optionIndex}
            className={`flex items-center p-4 rounded-lg border-2 border-black cursor-pointer transition-all duration-200 ${
              selectedAnswer === option
                ? "bg-green-400 translate-x-[1px] translate-y-[1px] shadow-none"
                : "bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onOptionSelect(question.id, option)}
              className="hidden"
            />
            <div className="flex-shrink-0 w-8 h-8 bg-orange-200 border-2 border-black flex items-center justify-center font-bold mr-4">
              {String.fromCharCode(65 + optionIndex)}
            </div>
            <span className="text-lg">{option}</span>
          </label>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionDisplay;
