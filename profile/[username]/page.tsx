"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, stats(*)")
        .eq("username", username)
        .single();

      if (!error) setProfile(data);
    };
    fetchProfile();
  }, [username]);

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">@{profile.username}</h1>
      <p>{profile.bio}</p>
      <p>Mood: {profile.mood_status?.emoji} {profile.mood_status?.current}</p>
      <p>Joined: {new Date(profile.joined_at).toLocaleDateString()}</p>
    </div>
  );
}
