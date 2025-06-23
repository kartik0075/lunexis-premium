"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const username = "User"; // replace with actual username from auth

  useEffect(() => {
    const q = query(collection(db, "messages", "global", "chat"), orderBy("timestamp"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => doc.data()));
    });
    return unsub;
  }, []);

  const sendMessage = async () => {
    await addDoc(collection(db, "messages", "global", "chat"), {
      uid: "123",
      username,
      text,
      timestamp: serverTimestamp(),
    });
    setText("");
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="bg-zinc-800 p-2 rounded">
            <div className="text-xs text-gray-400">{m.username} · {new Date(m.timestamp?.toDate()).toLocaleTimeString()}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 bg-zinc-900 px-2 py-1" />
        <button onClick={sendMessage} className="bg-blue-600 px-3 py-1 rounded">Send</button>
      </div>
    </div>
  );
}
