"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchLeaderboard } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Award, Crown, BookOpen, Dumbbell, Music, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

const categoryColors = {
  academic: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  cultural: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  sports: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  overall: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
}

const categories = [
  { id: "academic", label: "Academic", icon: BookOpen, color: "text-blue-600" },
  { id: "sports", label: "Sports", icon: Dumbbell, color: "text-orange-600" },
  { id: "cultural", label: "Cultural", icon: Music, color: "text-green-600" },
  { id: "overall", label: "Overall", icon: TrendingUp, color: "text-purple-600" },
]

// Top 3 emojis for leaderboard positions
const getTopEmoji = (rank: number) => {
  switch (rank) {
    case 1: return "👑" // Crown for 1st
    case 2: return "🥈" // Silver medal for 2nd
    case 3: return "🥉" // Bronze medal for 3rd
    default: return null
  }
}

export function LeaderboardsPage() {
  const [activeCategory, setActiveCategory] = useState("academic")
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  })

  const filteredLeaderboard = leaderboard?.filter(
    (user) => user.category === activeCategory,
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
      <div className="px-4 sm:px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Leaderboards</h3>
            <p className="text-sm text-muted-foreground">Top contributors in our community</p>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              {filteredLeaderboard?.map((user, index) => {
                const topEmoji = getTopEmoji(user.rank)
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/30 transition-colors ${
                      index < 3 ? "bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-950/20" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-8 text-center">
                      {topEmoji ? (
                        <span className="text-2xl">{topEmoji}</span>
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">#{user.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-border/20">
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
                        <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                          {user.name}
                          {topEmoji && <span className="ml-1">{topEmoji}</span>}
                        </h4>
                        <Badge variant="outline" className={`text-xs flex-shrink-0 ${categoryColors[user.category]}`}>
                          {user.category}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Rank #{user.rank} in {user.category}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-foreground">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-500" />
                        <span>{user.score.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </motion.div>
                )
              })}

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
