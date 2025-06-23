"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ActivityPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    supabase
      .from("activity")
      .select("*, user:profiles(username, avatar_url)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setEvents(data));
  }, []);

  return (
    <div className="p-6 text-white space-y-4">
      <h2 className="text-xl font-bold">Activity Feed</h2>
      {events.map((event) => (
        <div key={event.id} className="border p-2 rounded bg-gray-800">
          <span className="font-semibold">@{event.user.username}</span> {event.action}
        </div>
      ))}
    </div>
  );
}
