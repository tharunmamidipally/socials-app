"use client"

import { useParams } from "next/navigation"

const clubEvents: Record<string, string[]> = {
  music: ["Concert Night", "Karaoke Battle"],
  tech: ["Hackathon", "AI Workshop"],
  sports: ["Football Tournament", "Cricket Match"],
}

export default function ClubDetailsPage() {
  const params = useParams()
  const clubId = params?.clubId as string
  const events = clubEvents[clubId] || []

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Events in {clubId} Club</h2>
      {events.length > 0 ? (
        <ul className="space-y-2">
          {events.map((event, index) => (
            <li key={index} className="p-3 rounded-lg bg-muted">
              {event}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No events available.</p>
      )}
    </div>
  )
}
