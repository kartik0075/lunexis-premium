
"use client";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 text-white px-4">
      <Image src="/lunexis-logo.png" alt="Lunexis Logo" width={200} height={200} className="mb-6 drop-shadow-lg" />
      <h1 className="text-5xl font-bold mb-4 tracking-tight">Welcome to Lunexis</h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Connect, create, and share in a cosmic new way. Lunexis is the next-gen social platform designed for vibrant expression and meaningful connections.
      </p>
      <Link href="/feed">
        <button className="px-6 py-2 bg-white text-blue-800 font-semibold rounded-full shadow-md hover:scale-105 transition">
          Enter the App 🚀
        </button>
      </Link>
    </main>
  );
}
