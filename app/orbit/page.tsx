"use client";
import { useRef, useState } from "react";

export default function OrbitPage() {
  const videoRef = useRef(null);
  const [live, setLive] = useState(false);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    setLive(true);
  };

  const stop = () => {
    const tracks = videoRef.current?.srcObject?.getTracks();
    tracks?.forEach(track => track.stop());
    setLive(false);
  };

  return (
    <div className="p-4">
      <video ref={videoRef} autoPlay className="rounded w-full" />
      <div className="mt-2 space-x-2">
        {!live && <button onClick={start} className="bg-green-600 px-3 py-1">Go Live</button>}
        {live && <button onClick={stop} className="bg-red-600 px-3 py-1">Stop Stream</button>}
      </div>
    </div>
  );
}
