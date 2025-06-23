"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Reactions({ snapId, initialLikes }: { snapId: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);

  const likeSnap = async () => {
    const { error } = await supabase.rpc("like_snap", { snap_id: snapId });
    if (!error) setLikes((prev) => prev + 1);
  };

  return (
    <button onClick={likeSnap} className="text-pink-500">❤️ {likes}</button>
  );
}