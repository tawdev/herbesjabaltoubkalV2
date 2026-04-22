"use client";

import { createContext, useContext, useCallback, useRef } from "react";

interface SoundContextType {
  playPaperSound: () => void;
  playMetallicSound: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const paperAudio = useRef<HTMLAudioElement | null>(null);
  const metallicAudio = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on first user interaction to comply with browser policies
  const initAudio = useCallback(() => {
    if (!paperAudio.current) {
        // Subtle paper rustle / scroll sound
        paperAudio.current = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_7316718a2d.mp3");
        paperAudio.current.volume = 0.15;
    }
    if (!metallicAudio.current) {
        // Subtle metallic ting / jewelry sound
        metallicAudio.current = new Audio("https://cdn.pixabay.com/audio/2022/03/24/audio_9855584869.mp3");
        metallicAudio.current.volume = 0.1;
    }
  }, []);

  const playPaperSound = useCallback(() => {
    initAudio();
    if (paperAudio.current) {
      paperAudio.current.currentTime = 0;
      paperAudio.current.play().catch(() => {});
    }
  }, [initAudio]);

  const playMetallicSound = useCallback(() => {
    initAudio();
    if (metallicAudio.current) {
      metallicAudio.current.currentTime = 0;
      metallicAudio.current.play().catch(() => {});
    }
  }, [initAudio]);

  return (
    <SoundContext.Provider value={{ playPaperSound, playMetallicSound }}>
      <div onClick={initAudio} className="contents">
        {children}
      </div>
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within a SoundProvider");
  return context;
}
