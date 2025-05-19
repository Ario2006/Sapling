import { useTimer } from "@/context/TimerContext";
import { useAudio } from "@/context/AudioContext";
import { Card } from "@/components/ui/card";
import { Timer, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const TimerProgress = () => {
  const { timeRemaining, duration, isActive, treeStage } = useTimer();

  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;
  const formattedSeconds = secondsRemaining.toString().padStart(2, '0');

  const progressPercentage =
    isActive && duration > 0
      ? ((duration - timeRemaining) / duration) * 100
      : 0;

  const minuteProgress =
    secondsRemaining > 0 ? ((60 - secondsRemaining) / 60) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="relative w-72 h-72">
        {/* Outer progress circle */}
        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full radial-progress"
          style={{
            "--progress": `${progressPercentage}%`,
            "--progress-color": getStageColor(treeStage),
            "--background-color": "#f0e9c5",
            zIndex: 0,
          } as React.CSSProperties}
        />

        {/* Inner progress */}
        <div
          className="absolute w-64 h-64 top-[-50%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full radial-progress"
          style={{
            "--progress": `${minuteProgress}%`,
            "--progress-color": "rgba(138, 85, 54, 0.85)",
            "--background-color": "#FEF7CD",
            zIndex: 1,
          } as React.CSSProperties}
        />

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {isActive ? (
            <div className="text-center">
              <span className="text-5xl font-bold">{minutesRemaining}</span>
              <span className="text-4xl">:{formattedSeconds}</span>
              <div className="text-sm text-sapling-foreground/70">
                minutes remaining
              </div>
            </div>
          ) : (
            <Clock className="h-12 w-12 text-sapling-foreground/50" />
          )}
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex gap-2 mt-2">
        <StageIndicator active={progressPercentage >= 0} color="bg-amber-700" />
        <StageIndicator active={progressPercentage >= 40} color="bg-sapling-secondary" />
        <StageIndicator active={progressPercentage >= 70} color="bg-sapling-primary" />
        <StageIndicator active={progressPercentage >= 90} color="bg-green-600" />
      </div>
    </div>
  );
};

// Helper components
const StageIndicator = ({ active, color }: { active: boolean, color: string }) => (
  <div className={cn("w-4 h-4 rounded-full", active ? color : "bg-slate-300")}></div>
);

// Helper function to get colors based on tree stage
const getStageColor = (treeStage: string) => {
  switch (treeStage) {
    case 'seed':
      return '#CD853F'; // amber-700
    case 'sapling':
      return '#89B24A'; // sapling-secondary
    case 'plant':
      return '#4D8C57'; // sapling-primary
    case 'tree':
    case 'treeWithFruits':
      return '#2E8540'; // green-600
    case 'dead':
      return '#9CA3AF'; // gray-500
    default:
      return '#CBD5E1'; // slate-300
  }
};
