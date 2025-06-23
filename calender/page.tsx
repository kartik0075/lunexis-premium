"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function MoodCalendar() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("moods")
      .select("mood, emoji, timestamp")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: true })
      .then(({ data }) => setEntries(data));
  }, [user]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Mood Journal</h2>
      <ul className="space-y-2">
        {entries.map((e, i) => (
          <li key={i} className="border-b border-gray-600 pb-1">
            {e.emoji} {e.mood} — {new Date(e.timestamp).toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
