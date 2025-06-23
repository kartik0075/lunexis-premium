"use client";
import { useTheme } from "next-themes";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="galaxy">Galaxy</option>
    </select>
  );
}