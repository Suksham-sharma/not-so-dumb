import { z } from "zod";

export const quizValidationSchema = z.object({
  numQuestions: z.number().int().min(1).max(20),
  difficulty: z.string().min(2),
  topic: z.string().min(2).max(100),
  sources: z
    .object({
      youtubeLink: z.string().url().optional(),
      articleLink: z.string().url().optional(),
    })
    .optional(),
  sourceContent: z.string().nullable().optional(),
});

export function generateQuizPrompt({
  numQuestions,
  difficulty,
  topic,
  sources,
  sourceContent,
}: z.infer<typeof quizValidationSchema>) {
  return `Generate a quiz with ${numQuestions} multiple choice questions about ${topic} at a ${difficulty} difficulty level.

For each question, provide:
1. A clear and concise question
2. Four distinct options labeled A, B, C, and D
3. The correct answer letter
4. A detailed explanation of why this is the correct answer

${
  sources?.youtubeLink
    ? `Consider this YouTube video content: ${sourceContent}`
    : ""
}
${sources?.articleLink ? `Consider this article content: ${sourceContent}` : ""}

Format the response as a JSON object with the following structure:
{
  "heading": "A concise 1-2 word quiz title based on the topic and difficulty",
  "questions": [
    {
      "id": "A unique number for each question",
      "question": "The question text",
      "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
      "correctAnswer": "A",
      "explanation": "Detailed explanation of the correct answer"
    }
  ]
}

Ensure the heading is engaging and reflective of the quiz content. The questions array should contain ${numQuestions} question objects.`;
}
