import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizInput {
  topic: string;
  questions: QuizQuestion[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Bodwqy", body);
    const { topic, questions }: QuizInput = body;

    console.log("data", topic, questions);

    const quiz = await prisma.quiz.create({
      data: {
        heading: topic,
        questions: {
          create: questions.map((q: QuizQuestion) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: { questions: true },
      });

      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      return NextResponse.json(quiz);
    }

    const quizzes = await prisma.quiz.findMany({
      include: { questions: true },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
