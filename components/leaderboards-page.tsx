"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchLeaderboard } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Award } from "lucide-react"

const categoryColors = {
  academic: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  social: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  sports:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  overall:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
}

const categories = [
  { id: "all", label: "All Categories" },
  { id: "academic", label: "Academic" },
  { id: "social", label: "Social" },
  { id: "sports", label: "Sports" },
  { id: "overall", label: "Overall" },
]

export function LeaderboardsPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  })

  const filteredLeaderboard = leaderboard?.filter(
    (user) => activeCategory === "all" || user.category === activeCategory,
  )

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col w-full bg-background h-full">
        <div className="px-6 py-4 border-b border-border/40 flex-shrink-0">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="flex-1 p-6 overflow-hidden">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full bg-background h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Leaderboards</h3>
            <p className="text-sm text-muted-foreground">Top contributors in our community</p>
          </div>
        </div>

        {/* Scrollable Tabs */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="space-y-3">
              {filteredLeaderboard?.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/30 transition-colors ${
                    index < 3 ? "bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-950/20" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 text-center">
                    {user.badge ? (
                      <span className="text-2xl">{user.badge}</span>
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">#{user.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-12 h-12 border-2 border-border/20">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-sm font-medium">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-base text-foreground truncate">{user.name}</h4>
                      <Badge variant="outline" className={`text-xs flex-shrink-0 ${categoryColors[user.category]}`}>
                        {user.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Rank #{user.rank} in {user.category}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                      <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                      <span>{user.score.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}

              {filteredLeaderboard?.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
