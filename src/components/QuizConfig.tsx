import React from "react";
import { motion } from "framer-motion";

interface QuizConfigProps {
  onSubmit: (config: {
    numQuestions: number;
    difficulty: string;
    topic: string;
  }) => void;
  isLoading?: boolean;
}

const QuizConfig: React.FC<QuizConfigProps> = ({ onSubmit, isLoading }) => {
  const [numQuestions, setNumQuestions] = React.useState<number>(5);
  const [difficulty, setDifficulty] = React.useState<number>(1);
  const [topic, setTopic] = React.useState<string>("");

  const difficultyEmojis = ["😊", "🙂", "😐", "😈"];
  const difficultyLabels = ["easy", "medium-easy", "medium", "hard"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      numQuestions,
      difficulty: difficultyLabels[difficulty],
      topic,
    });
  };

  const getSliderBackground = (value: number, max: number) => {
    const percentage = ((value - 5) / (max - 5)) * 100;
    return `linear-gradient(to right, #4ade80 ${percentage}%, #e5e7eb ${percentage}%)`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 bg-yellow-300 text-black rounded-full text-sm font-bold mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
          >
            Quiz Configuration
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold mb-4"
          >
            Customize Your Quiz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Set up your quiz parameters and get ready to challenge yourself!
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-orange-100/80 p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <label
              htmlFor="topic"
              className="block text-lg font-bold text-black mb-2"
            >
              Quiz Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none bg-white"
              placeholder="Enter the topic for your quiz"
              required
            />
          </div>

          <div>
            <label
              htmlFor="numQuestions"
              className="block text-lg font-bold text-black mb-2"
            >
              Number of Questions: {numQuestions}
            </label>
            <div className="relative">
              <input
                type="range"
                id="numQuestions"
                min="5"
                max="20"
                step="5"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: getSliderBackground(numQuestions, 20),
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 px-1 mt-2">
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-lg font-bold text-black mb-2"
            >
              Difficulty Level: {difficultyEmojis[difficulty]}
            </label>
            <div className="relative">
              <input
                type="range"
                id="difficulty"
                min="0"
                max="3"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4ade80 ${
                    (difficulty / 3) * 100
                  }%, #e5e7eb ${(difficulty / 3) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-xs font-semibold text-gray-600 px-1 mt-2">
                <span>Easy</span>
                <span>Hard</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-400 text-black font-bold py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating Quiz..." : "Generate Quiz"}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default QuizConfig;
