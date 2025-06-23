"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [streams, setStreams] = useState<any[]>([]);

  useEffect(() => {
    const fetchLive = async () => {
      const { data } = await supabase
        .from("orbit_streams")
        .select("id, username, started_at")
        .eq("active", true);
      setStreams(data || []);
    };
    fetchLive();
  }, []);

  return (
    <main className="text-white p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">🌌 Welcome to Lunexis</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard title="🎬 Vision" href="/vision" description="Upload & explore long-form videos" />
        <FeatureCard title="🚀 Orbit" href="/orbit" description="Go live and stream your mood" />
        <FeatureCard title="🌈 Ambient Status" href="/ambient" description="Update your mood aura" />
        <FeatureCard title="💬 Chat" href="/chat" description="Message your connections in real time" />
        <FeatureCard title="📸 Snap (Coming Soon)" href="#" description="Dual cam mood capture" />
        <FeatureCard title="🔮 Nova AI (Coming Soon)" href="#" description="Your creative emotional assistant" />
      </div>

      <section className="mt-12">
        <h3 className="text-xl font-semibold mb-4">🟢 Live Now</h3>
        <ul className="space-y-2">
          {streams.length === 0 && <p className="text-gray-400">No one is live right now.</p>}
          {streams.map((stream) => (
            <li key={stream.id} className="bg-white/5 p-4 rounded">
              <div className="text-white">{stream.username}</div>
              <div className="text-sm text-gray-400">
                Started at: {new Date(stream.started_at).toLocaleTimeString()}
              </div>
              <Link href="/orbit" className="text-blue-400 underline text-sm">
                Join Stream
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function FeatureCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link href={href} className="block bg-white/5 p-4 rounded hover:bg-white/10 transition">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-300">{description}</p>
    </Link>
  );
}
