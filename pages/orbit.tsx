"use client";
import { useEffect, useState } from "react";
import { Room, connect } from "livekit-client";
import { supabase } from "@/lib/supabaseClient";

export default function OrbitPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [joined, setJoined] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);

  const joinRoom = async () => {
    const token = await fetch("/api/livekit-token").then((res) => res.text());
    const room = await connect("wss://lunexis-orbit-8nhhwtwo.livekit.cloud", token, {
      video: true,
      audio: true,
    });
    setRoom(room);
    setJoined(true);

    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      const { data, error } = await supabase.from("orbit_streams").insert({
        user_id: user.user.id,
        username: user.user.email,
        started_at: new Date().toISOString(),
        active: true,
      }).select().single();
      if (data) setStreamId(data.id);
    }
  };

  const stopStream = async () => {
    room?.disconnect();
    setJoined(false);
    if (streamId) {
      await supabase.from("orbit_streams").update({ active: false }).eq("id", streamId);
    }
  };

  useEffect(() => {
    if (!joined) joinRoom();
    return () => room?.disconnect();
  }, []);

  return (
    <div className="text-white p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">🚀 Orbit Livestream (LiveKit Room)</h2>
      {!joined ? (
        <p>Connecting to LiveKit...</p>
      ) : (
        <>
          <p className="text-green-400">You are live 🚀</p>
          <button onClick={stopStream} className="bg-red-500 px-4 py-2 rounded">Stop Stream</button>
        </>
      )}
    </div>
  );
}