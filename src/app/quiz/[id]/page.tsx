import React from "react";
import SharedQuizContainer from "@/components/quiz-test/SharedQuizContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SharedQuizPage({ params }: PageProps) {
  const { id } = await params;
  return <SharedQuizContainer id={id} />;
}
