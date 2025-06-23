"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function VideoUpload({ type = "glow" }: { type: "glow" | "vision" }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadVideo = async () => {
    if (!file) return;
    setUploading(true);
    const { data, error } = await supabase.storage
      .from(type)
      .upload(`${Date.now()}-${file.name}`, file);
    setUploading(false);
    if (error) alert("Upload failed");
    else alert("Uploaded successfully!");
  };

  return (
    <div className="p-4">
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={uploadVideo} disabled={uploading} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
}