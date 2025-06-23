"use client"

import { useState } from "react"
import { TriggerCreator } from "./trigger-creator"
import { TriggerDashboard } from "./trigger-dashboard"
import type { MemoryTrigger } from "../../types/time-capsule"
import { useMemoryTriggers } from "../../hooks/use-memory-triggers"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Zap } from "lucide-react"

interface MemoryTriggersModuleProps {
  onBack: () => void
  onCreateMemory: (suggestion?: any) => void
}

export function MemoryTriggersModule({ onBack, onCreateMemory }: MemoryTriggersModuleProps) {
  const [showCreator, setShowCreator] = useState(false)
  const [editingTrigger, setEditingTrigger] = useState<MemoryTrigger | null>(null)

  const {
    triggers,
    notifications,
    isLoading,
    error,
    createTrigger,
    updateTrigger,
    deleteTrigger,
    toggleTrigger,
    markNotificationRead,
    clearNotifications,
    getTriggerStats,
  } = useMemoryTriggers()

  const handleCreateTrigger = () => {
    setEditingTrigger(null)
    setShowCreator(true)
  }

  const handleEditTrigger = (trigger: MemoryTrigger) => {
    setEditingTrigger(trigger)
    setShowCreator(true)
  }

  const handleSaveTrigger = async (triggerData: Partial<MemoryTrigger>) => {
    try {
      if (editingTrigger) {
        await updateTrigger(editingTrigger.id, triggerData)
      } else {
        await createTrigger(triggerData)
      }
      setShowCreator(false)
      setEditingTrigger(null)
    } catch (err) {
      console.error("Error saving trigger:", err)
    }
  }

  const handleCancelCreator = () => {
    setShowCreator(false)
    setEditingTrigger(null)
  }

  if (showCreator) {
    return (
      <TriggerCreator
        onSave={handleSaveTrigger}
        onCancel={handleCancelCreator}
        editingTrigger={editingTrigger || undefined}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Memory Triggers</span>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-slate-400">Loading memory triggers...</span>
          </div>
        ) : (
          <TriggerDashboard
            onCreateTrigger={handleCreateTrigger}
            onEditTrigger={handleEditTrigger}
            onCreateMemory={onCreateMemory}
          />
        )}
      </div>
    </div>
  )
}
