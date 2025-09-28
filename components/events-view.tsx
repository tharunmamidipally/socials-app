"use client"

import { format } from "date-fns"
import { Calendar, Clock, Users } from "lucide-react"
import type { Event } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EventsViewProps {
  events: Event[]
}

const categoryColors = {
  academic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  social: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  sports: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  career: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

const categoryIcons = {
  academic: "📚",
  social: "🎉",
  sports: "⚽",
  career: "💼",
}

export function EventsView({ events }: EventsViewProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-border/40">
        <h3 className="font-semibold text-lg">#events</h3>
        <p className="text-sm text-muted-foreground">Upcoming events and activities</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryIcons[event.category]}</span>
                    <Badge variant="secondary" className={`text-xs ${categoryColors[event.category]}`}>
                      {event.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(event.date, "MMM d")}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{event.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.attendees}
                      {event.maxAttendees && ` / ${event.maxAttendees}`}
                    </span>
                  </div>

                  <Button size="sm" className="h-8">
                    Join Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
