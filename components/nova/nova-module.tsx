"use client"

import { useState } from "react"
import { NovaChat } from "./nova-chat"
import { NovaTemplates } from "./nova-templates"
import { NovaWorkspace } from "./nova-workspace"
import { NovaAnalytics } from "./nova-analytics"
import type { NovaTemplate } from "../../types/nova"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MessageSquare, Sparkles, FolderOpen, BarChart3, Brain, Zap } from "lucide-react"

interface NovaModuleProps {
  onBack: () => void
}

export function NovaModule({ onBack }: NovaModuleProps) {
  const [activeTab, setActiveTab] = useState("chat")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  const handleSelectTemplate = (template: NovaTemplate) => {
    // TODO: Create new conversation with template
    console.log("Selected template:", template)
    setActiveTab("chat")
  }

  const handleNewConversation = () => {
    setSelectedConversation(null)
    setActiveTab("chat")
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    setActiveTab("chat")
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
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Nova Portal</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleNewConversation} className="border-slate-600 text-slate-300">
              <MessageSquare className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-73px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="flex h-full">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
              <div className="p-4">
                <TabsList className="grid w-full grid-cols-1 bg-slate-800/50 h-auto">
                  <TabsTrigger value="chat" className="justify-start data-[state=active]:bg-purple-500/20">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="justify-start data-[state=active]:bg-purple-500/20">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="workspace" className="justify-start data-[state=active]:bg-purple-500/20">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Workspace
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="justify-start data-[state=active]:bg-purple-500/20">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-slate-600 text-slate-300"
                    onClick={() => setActiveTab("templates")}
                  >
                    <Zap className="w-3 h-3 mr-2" />
                    Browse Templates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-slate-600 text-slate-300"
                    onClick={() => setActiveTab("workspace")}
                  >
                    <FolderOpen className="w-3 h-3 mr-2" />
                    Manage Workspace
                  </Button>
                </div>
              </div>

              {/* Nova Status */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Nova Online</span>
                  </div>
                  <div className="text-slate-400 text-xs">All AI models operational</div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <TabsContent value="chat" className="h-full m-0">
                <NovaChat
                  conversationId={selectedConversation || undefined}
                  onNewConversation={handleNewConversation}
                />
              </TabsContent>

              <TabsContent value="templates" className="h-full m-0">
                <NovaTemplates
                  onSelectTemplate={handleSelectTemplate}
                  onCreateNew={() => console.log("Create new template")}
                />
              </TabsContent>

              <TabsContent value="workspace" className="h-full m-0">
                <NovaWorkspace
                  onSelectConversation={handleSelectConversation}
                  onNewConversation={handleNewConversation}
                  onNewWorkspace={() => console.log("Create new workspace")}
                />
              </TabsContent>

              <TabsContent value="analytics" className="h-full m-0">
                <NovaAnalytics />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
