import React from "react";
import TopBar from "@/components/TopBar";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-orange-200/15 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] relative overflow-hidden">
      <TopBar />
      <div className="pt-14 pb-4 relative">
        <div className="absolute inset-0" />
        <main className="mx-auto px-2 py-3 md:p-4 relative">{children}</main>
      </div>
    </div>
  );
}
