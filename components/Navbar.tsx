"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-black text-white flex justify-between p-4 items-center">
      <div className="font-bold text-lg">Lunexis ✨</div>
      <div className="space-x-4">
        <Link href="/chat">Chat</Link>
        <Link href="/snaps">Snaps</Link>
        <Link href="/orbit">Orbit</Link>
        <Link href="/music">Cosmic Music</Link>
        {user && <Link href="/dashboard">Dashboard</Link>}
      </div>
    </nav>
  );
}
