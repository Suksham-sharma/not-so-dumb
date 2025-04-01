import { FadeIn } from "@/components/ui/motion";
import { motion } from "framer-motion";
import Image from "next/image";
const EmptyState = ({
  onAddClick,
  isEmpty,
}: {
  onAddClick: () => void;
  isEmpty: boolean;
}) => (
  <FadeIn className="col-span-full p-8 bg-white/80 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
    <div className="flex items-center gap-8">
      <motion.img
        src="/GetStarted.png"
        alt="Get Started Illustration"
        className="w-56 h-56 object-contain flex-shrink-0"
        initial={{ scale: 0.8, opacity: 0, x: -20 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      />
      <div className="flex-1 space-y-4">
        <motion.h3
          className="text-2xl font-bold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {isEmpty ? "Time to Build Your Knowledge Base!" : "No Matches Found"}
        </motion.h3>
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isEmpty
            ? "Your Second Brain is ready to grow. Start by adding your favorite articles, videos, or any online resources you want to remember."
            : "Try adjusting your search terms or filters to find what you're looking for."}
        </motion.p>
        {isEmpty && (
          <motion.button
            onClick={onAddClick}
            className="mt-4 px-6 py-3 bg-orange-400 text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none inline-flex items-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image src="/feather.png" alt="Add" width={20} height={20} />
            Add Your First Resource
          </motion.button>
        )}
      </div>
    </div>
  </FadeIn>
);

export default EmptyState;
