import { useTimer, TreeStage } from "@/context/TimerContext";
import { motion } from "framer-motion";
import { CirclePlay, CirclePause, CircleStop, Timer, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/context/AudioContext";
import { useEffect } from "react";
import images from "@/assets/images";

export const TreeVisualization = () => {
  const { 
    treeStage, 
    isActive, 
    isPaused, 
    hasPausedOnce,
    pauseTimer,
    resumeTimer,
    resetTimer,
    killTree 
  } = useTimer();
  
  const { playSound, isAudioOn } = useAudio();
  
  // Play sound when tree stage changes
  useEffect(() => {
    if (!isAudioOn) return;
    if (treeStage !== 'empty' && treeStage !== 'dead') {
      playSound('stage');
    } else if (treeStage === 'dead') {
      playSound('death');
    }
  }, [treeStage, playSound, isAudioOn]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="tree-container">
        <div className="ground"></div>
        {treeStage === 'empty' ? (
          <EmptyState />
        ) : (
          <TreeStageComponent stage={treeStage} />
        )}
      </div>
      
      {isActive && (
        <div className="flex gap-4">
          {!isPaused ? (
            <Button 
              variant="outline" 
              size="lg" 
              className="flex gap-2 items-center" 
              onClick={() => {
                if (isAudioOn) playSound('click');
                pauseTimer();
              }}
            >
              <CirclePause className="h-5 w-5" />
              Pause
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="lg" 
              className="flex gap-2 items-center" 
              onClick={() => {
                if (isAudioOn) playSound('click');
                resumeTimer();
              }}
            >
              <CirclePlay className="h-5 w-5" />
              Resume
            </Button>
          )}
          
          {hasPausedOnce && !isPaused ? (
            <Button 
              variant="destructive" 
              size="lg" 
              className="flex gap-2 items-center" 
              onClick={() => {
                if (isAudioOn) playSound('click');
                killTree();
              }}
            >
              <CircleStop className="h-5 w-5" />
              Kill Tree
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="lg" 
              className="flex gap-2 items-center" 
              onClick={() => {
                if (isAudioOn) playSound('click');
                resetTimer();
              }}
            >
              <Timer className="h-5 w-5" />
              Reset
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <p className="text-lg text-center font-medium mb-4">No timer active</p>
    <p className="text-sm text-center text-muted-foreground">
      Set a timer to start growing your tree
    </p>
    <Leaf className="h-12 w-12 text-sapling-primary mt-4 animate-bounce" />
  </div>
);

interface TreeStageComponentProps {
  stage: TreeStage;
}

const TreeStageComponent = ({ stage }: TreeStageComponentProps) => {
  // Define animations and styles for each tree stage
  const variants = {
    seed: {
      opacity: 1,
      scale: [0.8, 1],
      transition: { duration: 1 }
    },
    sapling: {
      opacity: 1,
      scale: [0.9, 1],
      transition: { duration: 1 }
    },
    plant: {
      opacity: 1,
      scale: [0.95, 1],
      transition: { duration: 1 }
    },
    tree: {
      opacity: 1,
      scale: [0.97, 1],
      transition: { duration: 1 }
    },
    dead: {
      opacity: [0.7, 0.5],
      filter: ["grayscale(0%)", "grayscale(100%)"],
      transition: { duration: 2 }
    }
  };

  // Get the appropriate image based on stage
  const getTreeImage = () => {
    switch (stage) {
      case 'seed':
        return images.seed;
      case 'sapling':
        return images.sapling;
      case 'plant':
        return images.plant;
      case 'tree':
        return images.tree;
      case 'treeWithFruits':
        return images.treeWithFruits;
      case 'dead':
        return images.deadTree;
      default:
        return images.seed;
    }
  };

  // Height mapping for each tree stage to ensure proper sizing
  const getImageHeight = () => {
    switch (stage) {
      case 'seed':
        return 'h-20';
      case 'sapling':
        return 'h-40';
      case 'plant':
        return 'h-56';
      case 'tree':
      case 'treeWithFruits':
        return 'h-64';
      case 'dead':
        return 'h-64';
      default:
        return 'h-16';
    }
  };

  const animationClass = stage === 'dead' ? '' : 'animate-sway';

  return (
    <div className="flex items-end justify-center h-full pb-10">
      <motion.div 
        className={`flex flex-col items-center justify-end ${animationClass}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={variants[stage]}
      >
        <img 
          src={getTreeImage()} 
          alt={`Tree stage: ${stage}`} 
          className={`object-contain ${getImageHeight()}`}
        />
      </motion.div>
    </div>
  );
};
