"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function NewPostForm() {
  const [content, setContent] = useState("");
  const [moodTags, setMoodTags] = useState("");
  const [type, setType] = useState("text");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      let uploadedImageUrl = null;
      if (image) uploadedImageUrl = await uploadImage(image);

      await addDoc(collection(db, "posts"), {
        content,
        moodTags: moodTags.split(",").map(tag => tag.trim()),
        type,
        createdAt: Timestamp.now(),
        imageUrl: uploadedImageUrl,
      });

      setContent("");
      setMoodTags("");
      setType("text");
      setImage(null);
      setImageUrl(null);
      setMessage("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl shadow mb-6 bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold">Create a Post</h2>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={4}
        required
      />
      <Input
        value={moodTags}
        onChange={(e) => setMoodTags(e.target.value)}
        placeholder="Mood tags (comma separated, e.g. happy,sad)"
      />
      <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded">
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>
      <Input type="file" accept="image/*" onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          setImage(e.target.files[0]);
          setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
      }} />
      {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 max-h-40 rounded" />}

      <Button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </Button>
      {message && <p className="text-sm text-center mt-2">{message}</p>}
    </form>
  );
}
