import React from "react";
import { motion } from "framer-motion";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: string;
  onOptionSelect: (questionId: number, option: string) => void;
}

const QuestionOption: React.FC<{
  option: string;
  optionIndex: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ option, optionIndex, isSelected, onSelect }) => (
  <label
    className={`flex items-center p-4 rounded-lg border-2 border-black cursor-pointer transition-all duration-200 ${
      isSelected
        ? "bg-green-400 translate-x-[1px] translate-y-[1px] shadow-none"
        : "bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    }`}
  >
    <input
      type="radio"
      className="hidden"
      onChange={onSelect}
      checked={isSelected}
    />
    <div className="flex-shrink-0 w-8 h-8 bg-orange-200 border-2 border-black flex items-center justify-center font-bold mr-4">
      {String.fromCharCode(65 + optionIndex)}
    </div>
    <span className="text-lg">{option}</span>
  </label>
);

const QuestionHeader: React.FC<{
  questionNumber: number;
  question: string;
}> = ({ questionNumber, question }) => (
  <div className="mb-8">
    <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 border-2 border-black transform rotate-12" />
    <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400 border-2 border-black transform -rotate-12" />
    <h3 className="text-2xl font-bold mb-6 relative z-10">
      <span className="relative inline-block">
        Question {questionNumber}
        <div className="absolute bottom-0 left-0 w-full h-3 bg-yellow-300 -z-10 transform -rotate-1" />
      </span>
    </h3>
    <p className="text-xl">{question}</p>
  </div>
);

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
      <QuestionHeader
        questionNumber={questionNumber}
        question={question.question}
      />
      <div className="space-y-4">
        {question.options.map((option, optionIndex) => (
          <QuestionOption
            key={optionIndex}
            option={option}
            optionIndex={optionIndex}
            isSelected={
              selectedAnswer === String.fromCharCode(65 + optionIndex)
            }
            onSelect={() =>
              onOptionSelect(question.id, String.fromCharCode(65 + optionIndex))
            }
          />
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionDisplay;
