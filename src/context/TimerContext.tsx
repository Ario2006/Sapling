import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

export type TreeStage = 'empty' | 'seed' | 'sapling' | 'plant' | 'tree' | 'treeWithFruits' | 'dead';

interface TimerContextType {
  duration: number;
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
  hasPausedOnce: boolean;
  treeStage: TreeStage;
  pomodoroCount: number;
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  killTree: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [duration, setDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasPausedOnce, setHasPausedOnce] = useState(false);
  const [treeStage, setTreeStage] = useState<TreeStage>('empty');
  const [pomodoroCount, setPomodoroCount] = useState(() => {
    const saved = localStorage.getItem('pomodoroCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Save pomodoro count to local storage
  useEffect(() => {
    localStorage.setItem('pomodoroCount', pomodoroCount.toString());
  }, [pomodoroCount]);

  // Update tree stage based on time remaining
  const updateTreeStage = useCallback(() => {
    if (!isActive || duration === 0) {
      setTreeStage('empty');
      return;
    }

    const progress = 1 - timeRemaining / duration;
    
    // Phase distribution:
    // Phase 1 (Seed): 40% of total time
    // Phase 2 (Sapling): 30% of total time
    // Phase 3 (Plant): 20% of total time
    // Phase 4 (Tree): 9% of total time
    // Phase 5 (TreeWithFruits): last 1% of time

    if (progress < 0.4) {
      setTreeStage('seed');
    } else if (progress < 0.7) {
      setTreeStage('sapling');
    } else if (progress < 0.9) {
      setTreeStage('plant');
    } else if (progress < 0.99) {
      setTreeStage('tree');
    } else {
      setTreeStage('treeWithFruits');
    }
  }, [isActive, duration, timeRemaining]);

  // Timer tick handler
  const tick = useCallback(() => {
    setTimeRemaining(prev => {
      if (prev <= 0) {
        // Timer completed
        setIsActive(false);
        setPomodoroCount(prev => prev + 1);
        setTreeStage('treeWithFruits');
        
        toast({
          title: "Timer Completed!",
          description: "You were so productive you saved and nurtured a life!",
          duration: 5000,
        });
        
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return 0;
      }
      return prev - 1;
    });
  }, [toast]);

  // Start timer
  const startTimer = useCallback((minutes: number) => {
    const durationInSeconds = minutes * 60;
    setDuration(durationInSeconds);
    setTimeRemaining(durationInSeconds);
    setIsActive(true);
    setIsPaused(false);
    setHasPausedOnce(false);
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(tick, 1000);
  }, [tick]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (isPaused) return;
    
    if (!hasPausedOnce) {
      setIsPaused(true);
      setHasPausedOnce(true);
      
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast({
        title: "Timer Paused",
        description: "You've used your one break. Pausing again will kill the tree.",
        duration: 5000,
      });
    } else {
      killTree();
    }
  }, [isPaused, hasPausedOnce, toast]);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (!isPaused) return;
    
    setIsPaused(false);
    intervalRef.current = window.setInterval(tick, 1000);
  }, [isPaused, tick]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setHasPausedOnce(false);
    setTimeRemaining(0);
    setDuration(0);
    setTreeStage('empty');
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Kill tree
  const killTree = useCallback(() => {
    setTreeStage('dead');
    setIsActive(false);
    setIsPaused(false);
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    toast({
      title: "Tree Died",
      description: "Focus broken. Your tree has withered away.",
      variant: "destructive",
      duration: 5000,
    });
    
    // Auto-reset after a short delay
    setTimeout(() => {
      resetTimer();
    }, 3000);
  }, [resetTimer, toast]);

  // Update tree stage whenever time remaining changes
  useEffect(() => {
    updateTreeStage();
  }, [timeRemaining, updateTreeStage]);

  // Keep timer running even when tab is changed
  useEffect(() => {
    if (!isActive || isPaused) return;
    
    let lastTime = Date.now();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Calculate time elapsed while away
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastTime) / 1000);
        
        if (elapsedSeconds > 0 && elapsedSeconds < timeRemaining) {
          setTimeRemaining(prev => Math.max(0, prev - elapsedSeconds));
        }
        
        lastTime = now;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, isPaused, timeRemaining]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <TimerContext.Provider
      value={{
        duration,
        timeRemaining,
        isActive,
        isPaused,
        hasPausedOnce,
        treeStage,
        pomodoroCount,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        killTree,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
