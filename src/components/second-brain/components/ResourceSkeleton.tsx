import { FadeIn } from "@/components/ui/motion";

const LinkCardSkeleton = () => (
  <FadeIn className="bg-white/90 p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative group">
    <div className="mb-4 h-48 rounded-lg border-2 border-black bg-gray-200 animate-pulse" />

    <div className="h-6 w-3/4 mb-2 bg-gray-200 rounded animate-pulse" />

    <div className="space-y-2 mb-3">
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
    </div>

    <div className="h-4 w-full bg-gray-200 rounded mb-3 animate-pulse" />

    <div className="flex gap-2 mb-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-6 w-16 rounded-full bg-gray-200 border-2 border-black animate-pulse"
        />
      ))}
    </div>
  </FadeIn>
);

export default LinkCardSkeleton;
