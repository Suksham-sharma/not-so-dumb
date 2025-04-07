import React from "react";
import { motion } from "framer-motion";
import TopicInput from "./TopicInput";
import SourceSelection from "./SourceSelection";
import SliderInput from "./SliderInput";

interface QuizConfigProps {
  onSubmit: (config: {
    numQuestions: number;
    difficulty: string;
    topic: string;
    sources?: {
      youtubeLink?: string;
      articleLink?: string;
    };
  }) => void;
  isLoading?: boolean;
}

const QuizConfig: React.FC<QuizConfigProps> = ({ onSubmit, isLoading }) => {
  const [numQuestions, setNumQuestions] = React.useState<number>(4);
  const [difficulty, setDifficulty] = React.useState<number>(1);
  const [topic, setTopic] = React.useState<string>("");
  const [showSources, setShowSources] = React.useState(false);
  const [sourceType, setSourceType] = React.useState<
    "youtube" | "article" | null
  >(null);
  const [youtubeLink, setYoutubeLink] = React.useState("");
  const [articleLink, setArticleLink] = React.useState("");

  const difficultyEmojis = ["😊", "🙂", "😐", "😈"];
  const difficultyLabels = ["easy", "medium-easy", "medium", "hard"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      numQuestions,
      difficulty: difficultyLabels[difficulty],
      topic,
      sources:
        showSources && sourceType
          ? {
              youtubeLink: sourceType === "youtube" ? youtubeLink : undefined,
              articleLink: sourceType === "article" ? articleLink : undefined,
            }
          : undefined,
    });
  };

  const handleSourceTypeChange = (type: "youtube" | "article") => {
    setSourceType(type);
    if (type === "youtube") {
      setArticleLink("");
    } else {
      setYoutubeLink("");
    }
  };

  const handleToggleSources = () => {
    setShowSources(!showSources);
    if (!showSources) {
      setSourceType(null);
      setYoutubeLink("");
      setArticleLink("");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-3 py-1 bg-yellow-300 text-black rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none hidden md:inline-block"
          >
            Quiz Configuration
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4"
          >
            Customize Your Quiz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-sm sm:text-base lg:text-lg"
          >
            Set up your quiz parameters and get ready to challenge yourself!
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className={`space-y-4 sm:space-y-6 bg-orange-100/80 p-3 sm:p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${
            isLoading ? "opacity-75 pointer-events-none" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TopicInput
            topic={topic}
            setTopic={setTopic}
            showSources={showSources}
            onToggleSources={handleToggleSources}
          />

          {showSources && (
            <SourceSelection
              sourceType={sourceType}
              onSourceTypeChange={handleSourceTypeChange}
              youtubeLink={youtubeLink}
              articleLink={articleLink}
              onYoutubeLinkChange={setYoutubeLink}
              onArticleLinkChange={setArticleLink}
            />
          )}

          <SliderInput
            value={numQuestions}
            onChange={setNumQuestions}
            min={2}
            max={10}
            step={2}
            label="Number of Questions"
            markers={["2", "4", "6", "8", "10"]}
          />

          <SliderInput
            value={difficulty}
            onChange={setDifficulty}
            min={0}
            max={3}
            label="Difficulty Level"
            labelSuffix={difficultyEmojis[difficulty]}
            markers={["Easy", "Hard"]}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-400 text-black font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-90 disabled:cursor-not-allowed relative overflow-hidden text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="relative flex items-center justify-center min-h-[20px] sm:min-h-[24px]">
                <span className="opacity-0">Generate Quiz</span>
                <div className="absolute inset-0 flex items-center justify-center gap-1 sm:gap-2">
                  <div className="relative">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white border-4 border-black rounded-lg animate-spin-slow transform rotate-3">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(251,146,60,0.9)_50%,transparent_75%)]" />
                    </div>
                    <div className="absolute -top-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 border-2 border-black rounded-sm animate-bounce-gentle" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 border-2 border-black rounded-sm animate-bounce-gentle delay-150" />
                  </div>
                  <span className="font-bold animate-pulse text-xs sm:text-sm">
                    Preparing Quiz...
                  </span>
                </div>
              </div>
            ) : (
              "Generate Quiz"
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default QuizConfig;
