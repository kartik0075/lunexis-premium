"use client"

import { useState } from "react"
import type { MemoryVault as MemoryVaultType } from "../../types/time-capsule"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Archive,
  Plus,
  Search,
  Grid,
  List,
  Calendar,
  Users,
  Eye,
  Heart,
  Settings,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react"

interface MemoryVaultProps {
  vaults: MemoryVaultType[]
  onSelectVault: (vault: MemoryVaultType) => void
  onCreateVault: () => void
}

export function MemoryVault({ vaults, onSelectVault, onCreateVault }: MemoryVaultProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"recent" | "name" | "size" | "activity">("recent")

  const filteredVaults = vaults
    .filter(
      (vault) =>
        vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vault.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vault.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return b.stats.totalCapsules - a.stats.totalCapsules
        case "activity":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      personal: Star,
      family: Users,
      travel: Archive,
      milestones: TrendingUp,
      creative: Star,
      professional: Archive,
      relationships: Heart,
      cosmic_journey: Star,
    }
    return icons[category] || Archive
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personal: "text-purple-400",
      family: "text-green-400",
      travel: "text-blue-400",
      milestones: "text-yellow-400",
      creative: "text-pink-400",
      professional: "text-orange-400",
      relationships: "text-red-400",
      cosmic_journey: "text-indigo-400",
    }
    return colors[category] || "text-slate-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Memory Vaults</h2>
          <p className="text-slate-400">Organize your time capsules into themed collections</p>
        </div>
        <Button onClick={onCreateVault} className="bg-gradient-to-r from-purple-500 to-pink-500">
          <Plus className="w-4 h-4 mr-2" />
          Create Vault
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search vaults..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800/50 border border-slate-600 rounded-lg text-white px-3 py-2"
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="activity">Activity</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-purple-500" : "border-slate-600"}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-purple-500" : "border-slate-600"}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Vaults Grid/List */}
      {filteredVaults.length > 0 ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredVaults.map((vault) => {
            const CategoryIcon = getCategoryIcon(vault.category)
            const categoryColor = getCategoryColor(vault.category)

            return (
              <Card
                key={vault.id}
                className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm hover:border-purple-500/30 cursor-pointer transition-all duration-200 group"
                onClick={() => onSelectVault(vault)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ background: vault.theme.colors.background }}
                      >
                        <CategoryIcon className={`w-6 h-6 ${categoryColor}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                          {vault.name}
                        </CardTitle>
                        <p className="text-slate-400 text-sm line-clamp-2">{vault.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Archive className="w-4 h-4" />
                        <span>{vault.stats.totalCapsules} capsules</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Eye className="w-4 h-4" />
                        <span>{vault.stats.totalViews} views</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Heart className="w-4 h-4" />
                        <span>{vault.stats.totalReactions} reactions</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{vault.collaborators.length} collaborators</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {vault.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {tag}
                        </Badge>
                      ))}
                      {vault.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          +{vault.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created {formatDate(vault.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated {formatDate(vault.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="flex items-center justify-between">
                      <Badge className={`${categoryColor} bg-slate-800/50 border-slate-600/50`}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {vault.category.replace("_", " ")}
                      </Badge>
                      {vault.isPublic && (
                        <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Archive className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Memory Vaults Found</h3>
          <p className="text-slate-400 mb-6">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Create your first memory vault to organize your time capsules"}
          </p>
          <Button onClick={onCreateVault} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Memory Vault
          </Button>
        </div>
      )}
    </div>
  )
}
