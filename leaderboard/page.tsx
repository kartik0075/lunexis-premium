"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("username, stats(totalEngagement, glowPosts)")
      .order("stats.totalEngagement", { ascending: false })
      .limit(10)
      .then(({ data }) => setUsers(data));
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Top Creators</h1>
      <ol className="list-decimal ml-6 space-y-2">
        {users.map((u, i) => (
          <li key={i}>@{u.username} - {u.stats.totalEngagement} points</li>
        ))}
      </ol>
    </div>
  );
}