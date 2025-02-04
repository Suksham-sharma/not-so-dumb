import React from "react";
import QuestionDisplay from "./QuestionDisplay";
import QuizProgress from "./QuizProgress";
import { FadeIn } from "../ui/motion";
import YellowButton from "../ui/yellow-button";
import { toast } from "sonner";
import StartQuiz from "./StartQuiz";
import QuizResults from "./QuizResults";
import QuizReview from "./QuizReview";
import { useQuizStore } from "@/store/quiz";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface TestScreenProps {
  questions: Question[];
  onSubmit: (answers: Record<number, string>) => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ questions, onSubmit }) => {
  const [showReview, setShowReview] = React.useState(false);
  const {
    answers: selectedAnswers,
    setAnswer,
    currentQuestion,
    setCurrentQuestion,
    visitedQuestions,
    addVisitedQuestion,
    isStarted,
    setIsStarted,
    isFinished,
    setIsFinished,
    timeTaken,
    setTimeTaken,
    score,
    setScore,
    reset,
  } = useQuizStore();

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished) {
      timer = setInterval(() => {
        setTimeTaken(timeTaken + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeTaken, setTimeTaken]);

  const handleOptionSelect = (questionId: number, option: string) => {
    console.log("handleOptionSelect", questionId, option);
    setAnswer(questionId, option);
    const questionIndex = questions.findIndex((q) => q.id === questionId);
    if (!visitedQuestions.includes(questionIndex)) {
      addVisitedQuestion(questionIndex);
    }
    console.log("selectedAnswers", selectedAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswers = questions.reduce((count, question) => {
      if (!question.correctAnswer || !selectedAnswers[question.id])
        return count;
      return selectedAnswers[question.id] === question.correctAnswer
        ? count + 1
        : count;
    }, 0);
    setScore(correctAnswers);
    setIsFinished(true);
    toast.success(
      `Quiz submitted successfully! Score: ${correctAnswers}/${questions.length}`,
      {
        position: "top-right",
        duration: 2000,
      }
    );
    onSubmit(selectedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      if (!visitedQuestions.includes(nextQuestion)) {
        addVisitedQuestion(nextQuestion);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      if (!visitedQuestions.includes(prevQuestion)) {
        addVisitedQuestion(prevQuestion);
      }
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index);
    if (!visitedQuestions.includes(index)) {
      addVisitedQuestion(index);
    }
  };

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const currentQuestionData = questions[currentQuestion];

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleRetry = () => {
    reset();
  };

  if (!isStarted) {
    return <StartQuiz onStart={handleStart} topic="History Quiz" />;
  }

  if (isFinished) {
    if (showReview) {
      return (
        <QuizReview
          questions={questions}
          userAnswers={selectedAnswers}
          onBack={() => setShowReview(false)}
        />
      );
    }
    return (
      <QuizResults
        score={score}
        totalQuestions={questions.length}
        timeTaken={timeTaken}
        correctAnswers={score}
        visitedQuestions={visitedQuestions}
        onRetry={handleRetry}
        onReview={() => setShowReview(true)}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-4 md:p-8 ">
      <div className="absolute inset-0 bg-white/50" />
      <div className="relative max-w-7xl mx-auto mb-8">
        <FadeIn>
          <YellowButton className="relative text-lg">🎯 Quiz Time</YellowButton>
        </FadeIn>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Questions Section */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-8">
            <QuestionDisplay
              question={currentQuestionData}
              questionNumber={currentQuestion + 1}
              selectedAnswer={selectedAnswers[currentQuestionData.id]}
              onOptionSelect={handleOptionSelect}
            />

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex-1 bg-gray-200 text-black font-bold py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                Previous
              </button>
              {currentQuestion === questions.length - 1 ? (
                <button
                  type="submit"
                  disabled={answeredQuestions < totalQuestions}
                  className="flex-1 bg-orange-400 text-black font-bold py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-orange-400 text-black font-bold py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Progress Section */}
        <div className="lg:col-span-1">
          <QuizProgress
            totalQuestions={totalQuestions}
            answeredQuestions={answeredQuestions}
            currentQuestion={currentQuestion}
            visitedQuestions={visitedQuestions}
            answeredQuestionsArray={Object.keys(selectedAnswers).map(Number)}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>
    </div>
  );
};

export default TestScreen;
