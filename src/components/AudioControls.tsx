import { useState, useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX } from "lucide-react";
import { Label } from "@/components/ui/label";

export const AudioControls = () => {
  const { 
    isMusicEnabled, 
    musicVolume,
    toggleMusic,
    setMusicVolume,
    playSound
  } = useAudio();
  
  const trackMap: { [key: string]: string } = {
    Dawn: "/Dawn.mp3",
    Dusk: "/Dusk.mp3",
    Forest: "/Forest.mp3",
    Grass: "/Grass.mp3",
  };
  const musicTracks = Object.keys(trackMap);
  const [selectedTrack, setSelectedTrack] = useState("Forest");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isMusicEnabled) {
      audioRef.current?.pause();
      return;
    }

    const audioSrc = window.location.origin + trackMap[selectedTrack];
    if (!audioRef.current || audioRef.current.src !== audioSrc) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(trackMap[selectedTrack]);
      audio.loop = true;
      audio.volume = musicVolume;
      audioRef.current = audio;
    } else {
      audioRef.current.volume = musicVolume;
    }

    audioRef.current.play().catch(() => {
      // Autoplay might be blocked by browser, ignore silently
    });

    return () => {
      audioRef.current?.pause();
    };
  }, [selectedTrack, isMusicEnabled, musicVolume]);

  // On mount, trigger playback if music is enabled and a track is selected
  useEffect(() => {
    if (isMusicEnabled && selectedTrack) {
      const audioSrc = window.location.origin + trackMap[selectedTrack];
      if (!audioRef.current || audioRef.current.src !== audioSrc) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(trackMap[selectedTrack]);
        audio.loop = true;
        audio.volume = musicVolume;
        audioRef.current = audio;
      }
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked by browser, ignore silently
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleMusicSliderChange = (value: number[]) => {
    setMusicVolume(value[0]);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={() => playSound('click')}
        >
          {isMusicEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-sapling-background border-sapling-border">
        <DropdownMenuLabel>Audio Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="music-toggle" className="text-sm">Background Music</Label>
              <Switch 
                id="music-toggle" 
                checked={isMusicEnabled} 
                onCheckedChange={toggleMusic} 
              />
            </div>
            <div className="px-1">
              <select
                className="w-full rounded-md border p-1 text-sm bg-sapling-background border-sapling-border"
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                disabled={!isMusicEnabled}
              >
                {musicTracks.map((track) => (
                  <option key={track} value={track}>
                    {track.replace(".mp3", "")}
                  </option>
                ))}
              </select>
            </div>
            <div className="px-1">
              <Slider
                value={[musicVolume]}
                min={0}
                max={1}
                step={0.01}
                disabled={!isMusicEnabled}
                onValueChange={handleMusicSliderChange}
              />
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
