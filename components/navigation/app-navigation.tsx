"use client"
import { Button } from "@/components/ui/button"
import { Home, Sparkles, Video, Radio, User, MessageCircle, Archive, Zap } from "lucide-react"
import { LunexisLogo } from "../ui/lunexis-logo"

interface AppNavigationProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function AppNavigation({ currentView, onViewChange }: AppNavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "glow", label: "Glow", icon: Sparkles },
    { id: "vision", label: "Vision", icon: Video },
    { id: "orbit", label: "Orbit", icon: Radio },
    { id: "nova", label: "Nova", icon: Zap },
    { id: "capsules", label: "Capsules", icon: Archive },
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700/50">
      {/* Top logo bar */}
      <div className="flex items-center justify-center py-2 border-b border-slate-700/30">
        <LunexisLogo size="sm" showText={false} />
      </div>

      {/* Navigation items */}
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive ? "text-purple-400 bg-purple-500/10" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
