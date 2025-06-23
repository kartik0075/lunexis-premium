"use client";
import { useState, useEffect } from "react";

export default function Player({ mood }: { mood: string }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const newAudio = new Audio(`/moods/${mood}.mp3`);
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
    return () => newAudio.pause();
  }, [mood]);

  return null;
}