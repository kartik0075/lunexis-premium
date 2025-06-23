"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { supabase } from "@/lib/supabaseClient";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Listen to Firestore messages in real time
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    return onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  useEffect(() => {
    // Get Supabase user on mount
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUsername(data.user.email || "Anonymous");
      }
    };
    fetchUser();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !username) return;
    await addDoc(collection(db, "messages"), {
      text: message,
      createdAt: serverTimestamp(),
      username: username,
    });
    setMessage("");
  };

  return (
    <div className="text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">💬 Chat Room</h2>
      <div className="h-64 overflow-y-auto bg-white/5 p-2 rounded space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="bg-white/10 p-2 rounded">
            <div className="text-sm text-blue-300 font-semibold">{msg.username || "Unknown"}</div>
            <div>{msg.text}</div>
            <div className="text-xs text-gray-400">
              {msg.createdAt?.toDate?.().toLocaleTimeString?.() || "Pending..."}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 px-4 py-2 rounded"
          disabled={!username}
        >
          Send
        </button>
      </div>
    </div>
  );
}
