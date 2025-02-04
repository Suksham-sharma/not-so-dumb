import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { quizValidationSchema, generateQuizPrompt } from "@/lib/quiz";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = quizValidationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { numQuestions } = validationResult.data;
    const prompt = generateQuizPrompt(validationResult.data);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable quiz generator that creates engaging multiple-choice questions. Always return exactly ${numQuestions} questions in an array inside a JSON object with a 'questions' key.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
      return NextResponse.json(
        { error: "Failed to generate quiz" },
        { status: 500 }
      );
    }

    const response = JSON.parse(completion.choices[0].message.content);

    if (
      !response.questions ||
      !Array.isArray(response.questions) ||
      response.questions.length !== numQuestions
    ) {
      return NextResponse.json(
        {
          error: "Invalid quiz format",
          details: `Expected ${numQuestions} questions but received ${
            response.questions?.length || 0
          }`,
        },
        { status: 500 }
      );
    }

    // Ensure each question has an ID
    response.questions = response.questions.map(
      (question: any[], index: number) => ({
        ...question,
        id: index + 1,
      })
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
