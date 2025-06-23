"use client";
import { useEffect, useState } from "react";

export default function CosmicMusic({ mood = "Happy" }) {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const track = {
      Happy: "/music/happy.mp3",
      Sad: "/music/sad.mp3",
      Angry: "/music/angry.mp3",
      Neutral: "/music/chill.mp3",
    }[mood] || "/music/chill.mp3";

    const audioEl = new Audio(track);
    audioEl.play();
    setAudio(audioEl);

    return () => audioEl.pause();
  }, [mood]);

  return <div className="p-4">Now playing: {mood}</div>;
}
