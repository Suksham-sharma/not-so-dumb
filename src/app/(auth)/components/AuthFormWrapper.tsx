import { FadeIn } from "@/components/ui/motion";
import YellowButton from "@/components/ui/yellow-button";
import React from "react";

interface AuthFormWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthFormWrapper({
  children,
  title,
  subtitle,
}: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#80808012_1px,transparent_1px),linear-gradient(-45deg,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 border-2 border-black transform rotate-12 translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-300 border-2 border-black transform -rotate-12 -translate-x-8 translate-y-8" />
      <div className="absolute top-1/4 right-0 w-20 h-20 bg-orange-300 border-2 border-black transform -rotate-6 translate-x-4" />

      <div className="pt-14 pb-24 relative">
        <main className="mx-auto p-4 relative">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <FadeIn>
                <YellowButton className="mb-6 relative z-10">
                  {subtitle}
                </YellowButton>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-6xl font-black mb-6 leading-tight relative">
                  <span className="relative inline-block z-20">
                    {title}
                    <div className="absolute bottom-2 left-0 w-full h-4 bg-orange-300 -z-10 transform -rotate-2" />
                  </span>
                </h1>
              </FadeIn>
            </div>

            <FadeIn
              delay={0.2}
              className="relative bg-white/90 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-400 border-2 border-black transform -rotate-12" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-orange-400 border-2 border-black transform rotate-12" />
              {children}
            </FadeIn>
          </div>
        </main>
      </div>
    </div>
  );
}
