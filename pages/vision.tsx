"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VisionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState<string[]>([]);

  const uploadVideo = async () => {
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("vision").upload(fileName, file);
    if (!error) fetchVideos();
    setUploading(false);
  };

  const fetchVideos = async () => {
    const { data } = await supabase.storage.from("vision").list();
    const urls = await Promise.all(
      data?.map(async (file) => {
        const { data: url } = await supabase.storage.from("vision").createSignedUrl(file.name, 3600);
        return url?.signedUrl || "";
      }) || []
    );
    setVideos(urls);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">📽️ Upload a Vision (Long Video)</h2>
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={uploadVideo} disabled={uploading} className="bg-purple-500 px-4 py-2 rounded">
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <h3 className="mt-6 text-lg font-semibold">Your Visions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((url, i) => (
          <video key={i} src={url} controls className="rounded w-full" />
        ))}
      </div>
    </div>
  );
}