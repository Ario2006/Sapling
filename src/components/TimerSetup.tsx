
import { useState } from "react";
import { useTimer } from "@/context/TimerContext";
import { useAudio } from "@/context/AudioContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Timer, AlertCircle } from "lucide-react";

export const TimerSetup = () => {
  const { startTimer, isActive } = useTimer();
  const { playSound } = useAudio();
  const [selectedDuration, setSelectedDuration] = useState(25);
  
  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    playSound('click');
  };
  
  const handleSliderChange = (value: number[]) => {
    setSelectedDuration(value[0]);
  };
  
  const handleStartTimer = () => {
    playSound('click');
    startTimer(selectedDuration);
  };
  
  // Don't show setup if a timer is already active
  if (isActive) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span>New Timer</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Preset Durations</h3>
          <div className="flex gap-3">
            <Button 
              variant={selectedDuration === 25 ? "default" : "outline"} 
              onClick={() => handleDurationSelect(25)}
              className="flex-1"
            >
              25 min
            </Button>
            <Button 
              variant={selectedDuration === 50 ? "default" : "outline"} 
              onClick={() => handleDurationSelect(50)}
              className="flex-1"
            >
              50 min
            </Button>
            <Button 
              variant={selectedDuration === 90 ? "default" : "outline"} 
              onClick={() => handleDurationSelect(90)}
              className="flex-1"
            >
              90 min
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Custom Duration</h3>
          <Slider
            value={[selectedDuration]}
            min={10}
            max={90}
            step={1}
            onValueChange={handleSliderChange}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-sapling-foreground/70">
            <span>10 min</span>
            <span className="font-medium">{selectedDuration} min</span>
            <span>90 min</span>
          </div>
        </div>
        
        <Alert variant="default" className="bg-sapling-accent/50 border-sapling-accent">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            You can pause only once. Pausing again will kill the tree.
          </AlertDescription>
        </Alert>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleStartTimer} className="w-full" size="lg">
          Start Growing
        </Button>
      </CardFooter>
    </Card>
  );
};
