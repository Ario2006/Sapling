
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isMusicEnabled: boolean;
  isSFXEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  toggleMusic: () => void;
  toggleSFX: () => void;
  setMusicVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  playSound: (sound: 'click' | 'complete' | 'stage' | 'death') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('isMusicEnabled');
    return saved ? saved === 'true' : true;
  });
  
  const [isSFXEnabled, setIsSFXEnabled] = useState(() => {
    const saved = localStorage.getItem('isSFXEnabled');
    return saved ? saved === 'true' : true;
  });
  
  const [musicVolume, setMusicVolumeState] = useState(() => {
    const saved = localStorage.getItem('musicVolume');
    return saved ? parseFloat(saved) : 0.5;
  });
  
  const [sfxVolume, setSFXVolumeState] = useState(() => {
    const saved = localStorage.getItem('sfxVolume');
    return saved ? parseFloat(saved) : 0.5;
  });
  
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);
  const stageSoundRef = useRef<HTMLAudioElement | null>(null);
  const deathSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    // We'd normally load actual audio files here, but for this demo we'll simulate them
    backgroundMusicRef.current = new Audio();
    backgroundMusicRef.current.loop = true;
    
    clickSoundRef.current = new Audio();
    completeSoundRef.current = new Audio();
    stageSoundRef.current = new Audio();
    deathSoundRef.current = new Audio();
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Save settings to local storage
  useEffect(() => {
    localStorage.setItem('isMusicEnabled', isMusicEnabled.toString());
    localStorage.setItem('isSFXEnabled', isSFXEnabled.toString());
    localStorage.setItem('musicVolume', musicVolume.toString());
    localStorage.setItem('sfxVolume', sfxVolume.toString());
  }, [isMusicEnabled, isSFXEnabled, musicVolume, sfxVolume]);

  // Update music volume
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = musicVolume;
      
      if (isMusicEnabled && backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.play().catch(e => {
          console.log("Auto-play prevented by browser. User interaction required.", e);
        });
      } else if (!isMusicEnabled && !backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.pause();
      }
    }
  }, [isMusicEnabled, musicVolume]);

  const toggleMusic = () => {
    setIsMusicEnabled(prev => !prev);
  };

  const toggleSFX = () => {
    setIsSFXEnabled(prev => !prev);
  };

  const setMusicVolume = (volume: number) => {
    setMusicVolumeState(volume);
  };

  const setSFXVolume = (volume: number) => {
    setSFXVolumeState(volume);
  };

  const playSound = (sound: 'click' | 'complete' | 'stage' | 'death') => {
    if (!isSFXEnabled) return;
    
    let soundRef: React.MutableRefObject<HTMLAudioElement | null>;
    
    switch (sound) {
      case 'click':
        soundRef = clickSoundRef;
        break;
      case 'complete':
        soundRef = completeSoundRef;
        break;
      case 'stage':
        soundRef = stageSoundRef;
        break;
      case 'death':
        soundRef = deathSoundRef;
        break;
    }
    
    if (soundRef.current) {
      soundRef.current.volume = sfxVolume;
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(e => console.log("Error playing sound", e));
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isMusicEnabled,
        isSFXEnabled,
        musicVolume,
        sfxVolume,
        toggleMusic,
        toggleSFX,
        setMusicVolume,
        setSFXVolume,
        playSound
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
