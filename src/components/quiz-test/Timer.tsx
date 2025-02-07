import React from "react";
import { useQuizStore } from "@/store/quiz";

const useTimer = (
  isFinished: boolean,
  setTimeTaken: (time: number) => void
) => {
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    if (isFinished) {
      setTimeTaken(time);
      return;
    }

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, time, setTimeTaken]);

  return time;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const Timer = () => {
  const { isFinished, setTimeTaken } = useQuizStore();
  const time = useTimer(isFinished, setTimeTaken);

  return (
    <div className="relative inline-block">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-300 border-2 border-black transform rotate-12" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-300 border-2 border-black transform -rotate-12" />
      <div className="bg-white/90 px-6 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
        <div className="flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-400 border-2 border-black" />
          <span className="text-xl font-bold">{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};

export { formatTime };
export default Timer;
