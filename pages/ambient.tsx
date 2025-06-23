"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const moods = ["happy", "sad", "calm", "angry", "nostalgic"];

export default function AmbientPage() {
  const [selectedMood, setSelectedMood] = useState<string>("");

  const updateMood = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    await supabase.from("statuses").insert({ user_id: user.id, mood: selectedMood });
    alert("Mood updated!");
  };

  return (
    <div className="text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">🌈 Ambient Mood</h2>
      <select
        value={selectedMood}
        onChange={(e) => setSelectedMood(e.target.value)}
        className="text-black p-2 rounded"
      >
        <option value="">Select mood</option>
        {moods.map((mood) => (
          <option key={mood} value={mood}>
            {mood}
          </option>
        ))}
      </select>
      <button
        onClick={updateMood}
        disabled={!selectedMood}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        Set Mood
      </button>
    </div>
  );
}
