"use client";

import { useEffect, useState } from "react";

export function DarkToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed top-4 right-4 px-3 py-1 rounded bg-gray-800 text-white text-xs shadow-md transition-all duration-300 hover:scale-105"
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
