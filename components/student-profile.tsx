"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchStudentProfile } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Mail, Calendar, MessageCircle, Trophy, Users, Award } from "lucide-react"

interface StudentProfileProps {
  studentId: string
  onBack: () => void
}

const roleColors = {
  student: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  moderator: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

export function StudentProfile({ studentId, onBack }: StudentProfileProps) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["student-profile", studentId],
    queryFn: () => fetchStudentProfile(studentId),
  })

  if (isLoading) {
    return (
      <div className="flex-1 p-4 w-full">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex-1 p-4 w-full">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Student profile not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 w-full max-w-6xl mx-auto">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback className="text-2xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <Badge variant="secondary" className={`w-fit ${roleColors[profile.role]}`}>
                  {profile.role}
                </Badge>
              </div>
              <div className="space-y-1 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <p className="text-lg">{profile.department}</p>
                <p>{profile.year}</p>
              </div>
              <p className="text-sm leading-relaxed max-w-2xl">{profile.bio}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button>Send Message</Button>
              <Button variant="outline">Follow</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Activity Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Messages</span>
              </div>
              <span className="font-semibold">{profile.stats.messagesCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-sm">Events Attended</span>
              </div>
              <span className="font-semibold">{profile.stats.eventsAttended}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Leaderboard Rank</span>
              </div>
              <span className="font-semibold">#{profile.stats.leaderboardRank}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Joined</span>
              </div>
              <span className="font-semibold">{profile.stats.joinedDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interests Card */}
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
