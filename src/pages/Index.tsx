
import { Toaster } from "@/components/ui/sonner";
import { AudioProvider } from "@/context/AudioContext";
import { TimerProvider, useTimer } from "@/context/TimerContext";
import { AudioControls } from "@/components/AudioControls";
import { TimerProgress } from "@/components/TimerProgress";
import { TimerSetup } from "@/components/TimerSetup";
import { TreeVisualization } from "@/components/TreeVisualization";
import images from "@/assets/images";

const Index = () => {
  return (
    <AudioProvider>
      <TimerProvider>
        <div className="min-h-screen flex flex-col font-poppins">
          <header className="p-4 border-b border-sapling-border">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={images.logo} alt="Sapling" className="h-8" />
                <p className="text-xs bg-sapling-primary/10 text-sapling-primary px-2 py-1 rounded">
                  Pomodoro Timer
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PomodoroCounter />
                <AudioControls />
              </div>
            </div>
          </header>
          
          <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <section className="flex flex-col items-center justify-center">
                <TimerProgress />
                <TimerSetup />
              </section>
              
              <section className="flex flex-col items-center justify-center">
                <TreeVisualization />
              </section>
            </div>
          </main>
          
          <footer className="p-4 border-t border-sapling-border">
            <div className="container mx-auto text-center text-sm text-sapling-foreground/70">
              <p>Grow virtual trees as you focus with Sapling</p>
            </div>
          </footer>
        </div>
      </TimerProvider>
    </AudioProvider>
  );
};

// The PomodoroCounter component needs to be below the Index component to have access to useTimer
const PomodoroCounter = () => {
  const { pomodoroCount } = useTimer();
  
  return (
    <div className="flex items-center gap-1.5 bg-sapling-accent/50 px-3 py-1.5 rounded-full">
      <span className="text-xs text-sapling-foreground/70">Pomodoros:</span>
      <span className="text-sm font-medium">{pomodoroCount}</span>
    </div>
  );
};

export default Index;
