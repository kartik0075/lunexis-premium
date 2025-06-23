"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const params = useSearchParams();
  const uid = params.get("uid");
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      if (!uid) return;
      const q = query(collection(db, "posts"), where("uid", "==", uid));
      const snap = await getDocs(q);
      setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchPosts();
  }, [uid]);

  if (!uid) return <div className="p-4">Invalid profile URL</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border rounded p-4 bg-white dark:bg-gray-900 shadow">
              <p>{post.content}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Post" className="mt-2 rounded max-h-60" />}
              <p className="text-xs text-gray-500 mt-2">{new Date(post.createdAt?.seconds * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
