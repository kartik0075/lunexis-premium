"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function AvatarUploader() {
  const { user, refreshUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !user) return;
    setLoading(true);

    const path = `avatars/${user.id}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    await refreshUser();
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 px-3 py-1 rounded text-white"
      >
        {loading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
}