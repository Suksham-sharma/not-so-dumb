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
      className="bg-white/80 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <h3 className="text-xl font-bold mb-4">
        {questionNumber}. {question.question}
      </h3>
      <div className="space-y-3">
        {question.options.map((option, optionIndex) => (
          <label
            key={optionIndex}
            className={`flex items-center p-4 rounded-lg border-2 border-black cursor-pointer ${
              selectedAnswer === option
                ? "bg-green-400 translate-x-[1px] translate-y-[1px]"
                : "bg-white"
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
            <span className="text-lg w-8">
              {String.fromCharCode(65 + optionIndex)}.
            </span>
            <span className="text-lg">{option}</span>
          </label>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionDisplay;
