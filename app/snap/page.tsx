"use client";
import { useRef, useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Snaps() {
  const videoRef = useRef(null);
  const [url, setUrl] = useState("");

  const startCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const snap = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg"));
    const fileRef = ref(storage, `snaps/${Date.now()}.jpg`);
    await uploadBytes(fileRef, blob);
    const snapUrl = await getDownloadURL(fileRef);
    setUrl(snapUrl);
  };

  return (
    <div className="p-4">
      <video ref={videoRef} autoPlay className="rounded" />
      <div className="mt-2 space-x-2">
        <button onClick={startCam} className="bg-green-600 px-3 py-1">Start</button>
        <button onClick={snap} className="bg-blue-600 px-3 py-1">Snap</button>
      </div>
      {url && <img src={url} className="mt-4 rounded" />}
    </div>
  );
}
