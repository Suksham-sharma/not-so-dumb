"use client";
import { Button } from "@/components/ui/button";
import { FadeIn, GradientBlob } from "@/components/ui/motion";
import YellowButton from "@/components/ui/yellow-button";

export default function Header() {
  return (
    <header className="relative inset-0 flex min-h-[85dvh] w-full flex-col items-center justify-center overflow-hidden bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-white/50" />

      {/* Content */}
      <div className="relative mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px]">
        <FadeIn>
          <YellowButton className="mb-6">🚀 Launching Soon</YellowButton>
        </FadeIn>

        <FadeIn
          delay={0.1}
          className="text-4xl font-heading md:text-5xl lg:text-7xl"
        >
          AI Research Assistant{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Powered by the Web</span>
            <div className="absolute -bottom-2 left-0 h-3 w-full bg-blue-300" />
          </span>
        </FadeIn>

        <FadeIn
          delay={0.2}
          className="mx-auto my-12 mt-8 max-w-2xl text-lg font-normal leading-relaxed text-gray-600 md:text-xl lg:text-2xl lg:leading-relaxed"
        >
          Discover smarter, more accurate answers with our web-enhanced LLM.
        </FadeIn>

        <FadeIn delay={0.3} className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-14 border-2 border-black bg-green-400 px-8 text-lg font-heading shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none lg:text-xl"
          >
            Get started
          </Button>
          <Button
            variant="neutral"
            size="lg"
            className="h-14 border-2 border-black px-8 text-lg font-heading shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none lg:text-xl"
          >
            Learn more
          </Button>
        </FadeIn>
      </div>
    </header>
  );
}
