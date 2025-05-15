"use client";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import YellowButton from "@/components/ui/yellow-button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative inset-0 flex min-h-[85dvh] w-full flex-col items-center justify-center overflow-hidden bg-gray-50 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] px-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gray-50/50" />

      {/* Logo at top left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 lg:top-10 lg:left-10 z-10">
        <Link
          href="/"
          className="text-2xl font-heading text-black tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-3xl">🧠</span>
          <span className="relative">
            notSoDumb
            <div className="absolute -bottom-1 left-0 h-2 w-full bg-yellow-300 -z-10" />
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-4xl px-4 py-16 text-center md:py-20 lg:py-[150px]">
        <FadeIn>
          <YellowButton className="mb-4 md:mb-6">
            All-in-One Supercharged AI 🔥
          </YellowButton>
        </FadeIn>

        <FadeIn
          delay={0.1}
          className="text-3xl font-heading md:text-4xl lg:text-6xl"
        >
          Your Digital{" "}
          <span className="relative inline-block">
            <span className="relative z-10">AI Buddy</span>
            <div className="absolute -bottom-1 md:-bottom-2 left-0 h-2 md:h-3 w-full bg-blue-300" />
          </span>
        </FadeIn>

        <FadeIn
          delay={0.2}
          className="mx-auto my-8 md:my-10 lg:my-12 max-w-2xl text-base font-normal leading-relaxed text-gray-600 md:text-xl lg:text-2xl lg:leading-relaxed"
        >
          Intelligent research with web-powered LLM search, quiz generation from
          any source, and a second brain that stores and interacts with all your
          knowledge.
        </FadeIn>

        <FadeIn
          delay={0.3}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Link href="/home?destination=home" className="w-full md:w-auto">
            <Button
              size="lg"
              className="w-full h-12 md:h-14 border-2 border-black bg-green-400 px-6 md:px-8 text-base md:text-lg font-heading shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none lg:text-xl"
            >
              Start Researching
            </Button>
          </Link>
          <div className="flex flex-row gap-4 w-full md:w-auto">
            <Link href="/quiz?destination=quiz" className="w-1/2 md:w-auto">
              <Button
                variant="neutral"
                size="lg"
                className="w-full h-12 md:h-14 border-2 border-black px-6 md:px-8 text-base md:text-lg font-heading shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none lg:text-xl"
              >
                Generate Quiz
              </Button>
            </Link>
            <Link
              href="/second-brain?destination=second-brain"
              className="w-1/2 md:w-auto"
            >
              <Button
                variant="neutral"
                size="lg"
                className="w-full h-12 md:h-14 border-2 border-black bg-blue-400 px-6 md:px-8 text-base md:text-lg font-heading shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none lg:text-xl"
              >
                Access Brain
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </header>
  );
}
