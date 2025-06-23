"use client"

import type { MoodTag } from "../types/feed"
import { Button } from "@/components/ui/button"

interface MoodFilterProps {
  selectedMoods: MoodTag[]
  onMoodToggle: (mood: MoodTag) => void
}

const moodConfig: Record<MoodTag, { label: string; color: string; emoji: string }> = {
  calm: { label: "Calm", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", emoji: "🌊" },
  hyper: { label: "Hyper", color: "bg-red-500/20 text-red-300 border-red-500/30", emoji: "⚡" },
  inspired: { label: "Inspired", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", emoji: "✨" },
  dreamy: { label: "Dreamy", color: "bg-pink-500/20 text-pink-300 border-pink-500/30", emoji: "🌙" },
  energetic: { label: "Energetic", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", emoji: "🔥" },
  nostalgic: { label: "Nostalgic", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", emoji: "🍂" },
}

export function MoodFilter({ selectedMoods, onMoodToggle }: MoodFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-700/50">
      <span className="text-slate-300 text-sm font-medium mr-2">Filter by mood:</span>
      {Object.entries(moodConfig).map(([mood, config]) => (
        <Button
          key={mood}
          variant="outline"
          size="sm"
          onClick={() => onMoodToggle(mood as MoodTag)}
          className={`
            transition-all duration-300 border
            ${
              selectedMoods.includes(mood as MoodTag)
                ? config.color
                : "bg-slate-800/50 text-slate-400 border-slate-600/50 hover:bg-slate-700/50"
            }
          `}
        >
          <span className="mr-1">{config.emoji}</span>
          {config.label}
        </Button>
      ))}
    </div>
  )
}
