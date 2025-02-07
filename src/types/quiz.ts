export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id?: string;
  heading: string;
  topic: string;
  difficulty: string;
  questions: Question[];
  youtubeLink?: string;
  articleLink?: string;
}

export interface UserAnswers {
  [questionId: number]: string;
}
