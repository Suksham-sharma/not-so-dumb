import React from "react";
import { FadeIn } from "../ui/motion";
import YellowButton from "../ui/yellow-button";
import { Share2 } from "lucide-react";
import { useQuizSharing } from "@/hooks/useQuizSharing";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizReviewProps {
  topic: string;
  questions: Question[];
  userAnswers: Record<number, string>;
  onBack: () => void;
  quizId?: string;
}

const QuizReview: React.FC<QuizReviewProps> = ({
  topic,
  questions,
  userAnswers,
  onBack,
  quizId,
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
      <div className="absolute top-0 left-0 w-24 h-24 bg-yellow-300 border-2 border-black transform -rotate-12 -translate-x-6 -translate-y-6" />
      <div className="absolute bottom-0 right-0 w-28 h-28 bg-blue-300 border-2 border-black transform rotate-12 translate-x-6 translate-y-6" />
      <div className="absolute bottom-1/4 left-0 w-16 h-16 bg-orange-300 border-2 border-black transform rotate-6 -translate-x-3" />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative max-w-4xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-8 z-10">
            <YellowButton className="relative text-lg">
              📝 Quiz Review
            </YellowButton>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-black rounded-full text-sm font-bold border-2 border-black shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              <Share2 size={16} />
              Share Quiz
            </button>
          </div>
        </FadeIn>

        <div className="bg-white/90 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-8">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-orange-50 p-6 rounded-xl border-2 border-black"
              >
                {/* Question Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 bg-orange-400 border-2 border-black flex items-center justify-center font-bold rounded-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold flex-1">
                    {question.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {question.options.map((option, optionIndex) => {
                    const isSelected =
                      userAnswers[question.id] ===
                      String.fromCharCode(65 + optionIndex);
                    const isCorrect =
                      question.correctAnswer ===
                      String.fromCharCode(65 + optionIndex);

                    return (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-lg border-2 border-black transition-all ${
                          isSelected
                            ? isCorrect
                              ? "bg-green-100"
                              : "bg-red-100"
                            : isCorrect
                            ? "bg-green-100"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${
                              isSelected
                                ? isCorrect
                                  ? "bg-green-400"
                                  : "bg-red-400"
                                : isCorrect
                                ? "bg-green-400"
                                : "bg-white"
                            }`}
                          >
                            {isSelected && (
                              <span className="text-black text-sm">
                                {isCorrect ? "✓" : "×"}
                              </span>
                            )}
                            {!isSelected && isCorrect && (
                              <span className="text-black text-sm">✓</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <span
                              className={`${
                                isSelected || isCorrect ? "font-bold" : ""
                              }`}
                            >
                              {option}
                            </span>
                            {isSelected && !isCorrect && (
                              <div className="text-sm text-red-600 mt-1">
                                Your answer
                              </div>
                            )}
                            {isCorrect && (
                              <div className="text-sm text-green-600 mt-1">
                                {isSelected
                                  ? "Correct answer"
                                  : "The correct answer"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-black">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-400 border-2 border-black" />
                    Explanation
                  </h4>
                  <p className="text-gray-700">{question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full bg-blue-400 text-black font-bold py-3 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-blue-300 transform translate-y-full group-hover:translate-y-0 transition-transform" />
          <span className="relative z-10">Back to Results</span>
        </button>
      </div>
    </div>
  );
};

export default QuizReview;
