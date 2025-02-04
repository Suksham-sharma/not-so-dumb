import { create } from "zustand";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizState {
  heading: string;
  questions: QuizQuestion[];
  currentQuestion: number;
  answers: Record<number, string>;
  correctAnswers: Record<number, string>;
  score: number;
  timeTaken: number;
  isStarted: boolean;
  isFinished: boolean;
  visitedQuestions: number[];
  setQuestions: (questions: QuizQuestion[]) => void;
  setHeading: (heading: string) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: number, answer: string) => void;
  setScore: (score: number) => void;
  setTimeTaken: (time: number) => void;
  setIsStarted: (started: boolean) => void;
  setIsFinished: (finished: boolean) => void;
  addVisitedQuestion: (index: number) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  heading: "",
  questions: [],
  currentQuestion: 0,
  answers: {},
  correctAnswers: {},
  score: 0,
  timeTaken: 0,
  isStarted: false,
  isFinished: false,
  visitedQuestions: [0],

  setQuestions: (questions) =>
    set((state) => ({
      questions,
      correctAnswers: questions.reduce(
        (acc, q) => ({ ...acc, [q.id]: q.correctAnswer }),
        {}
      ),
    })),
  setHeading: (heading: string) => set({ heading }),
  setCurrentQuestion: (index) => set({ currentQuestion: index }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  setScore: (score) => set({ score }),
  setTimeTaken: (time) => set({ timeTaken: time }),
  setIsStarted: (started) => set({ isStarted: started }),
  setIsFinished: (finished) => set({ isFinished: finished }),
  addVisitedQuestion: (index) =>
    set((state) => ({
      visitedQuestions: state.visitedQuestions.includes(index)
        ? state.visitedQuestions
        : [...state.visitedQuestions, index],
    })),
  reset: () =>
    set({
      heading: "",
      questions: [],
      currentQuestion: 0,
      correctAnswers: {},
      answers: {},
      score: 0,
      timeTaken: 0,
      isStarted: false,
      isFinished: false,
      visitedQuestions: [0],
    }),
}));
