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
      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-blue-300 border-2 border-black transform rotate-12 translate-x-4 md:translate-x-8 -translate-y-4 md:-translate-y-8 hidden sm:block" />
      <div className="absolute bottom-0 left-0 w-32 md:w-40 h-32 md:h-40 bg-yellow-300 border-2 border-black transform -rotate-12 -translate-x-4 md:-translate-x-8 translate-y-4 md:translate-y-8 hidden sm:block" />
      <div className="absolute top-1/4 right-0 w-16 md:w-20 h-16 md:h-20 bg-orange-300 border-2 border-black transform -rotate-6 translate-x-2 md:translate-x-4 hidden sm:block" />

      <div className="pt-2 md:pt-8 pb-4 md:pb-10 relative">
        <main className="mx-auto p-4 relative">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4 md:mb-8">
              <FadeIn>
                <YellowButton className="mb-3 md:mb-4 relative z-10">
                  {subtitle}
                </YellowButton>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-6xl font-black mb-3 md:mb-6 leading-tight relative">
                  <span className="relative inline-block z-20">
                    {title}
                    <div className="absolute bottom-2 left-0 w-full h-2 md:h-4 bg-orange-300 -z-10 transform -rotate-2" />
                  </span>
                </h1>
              </FadeIn>
            </div>

            <FadeIn
              delay={0.2}
              className="relative bg-white/90 p-4 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
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
