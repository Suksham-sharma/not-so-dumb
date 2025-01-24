"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="relative inset-0 flex min-h-[85dvh] w-full flex-col items-center justify-center overflow-hidden bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-100/30 to-blue-100/30 blur-3xl"
      />
      <div className="absolute inset-0 bg-white/50" />

      {/* Content */}
      <div className="relative mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-6 inline-block rounded-full border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
            🚀 Launching Soon
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-heading md:text-5xl lg:text-7xl"
        >
          AI Research Assistant{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Powered by the Web</span>
            <div className="absolute -bottom-2 left-0 h-3 w-full bg-blue-300" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto my-12 mt-8 max-w-2xl text-lg font-normal leading-relaxed text-gray-600 md:text-xl lg:text-2xl lg:leading-relaxed"
        >
          Discover smarter, more accurate answers with our web-enhanced LLM.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="h-14 border-2 border-black bg-green-400 px-8 text-lg font-heading shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none lg:text-xl"
          >
            Get started
          </Button>
          <Button
            variant="neutral"
            size="lg"
            className="h-14 border-2 border-black px-8 text-lg font-heading shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none lg:text-xl"
          >
            Learn more
          </Button>
        </motion.div>
      </div>
    </header>
  );
}
