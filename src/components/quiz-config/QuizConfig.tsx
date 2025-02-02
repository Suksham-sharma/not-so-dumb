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
    <div className="min-h-screen relative overflow-hidden p-8">
      <div className="max-w-xl mx-auto">
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
          className="space-y-6 bg-orange-100/80 p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
            className="w-full bg-orange-400 text-black font-bold py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating Quiz..." : "Generate Quiz"}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default QuizConfig;
