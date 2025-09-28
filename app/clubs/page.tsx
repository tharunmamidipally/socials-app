"use client"

import Link from "next/link"

const clubs = [
  { id: "music", name: "Music Club" },
  { id: "tech", name: "Tech Club" },
  { id: "sports", name: "Sports Club" },
]

export default function ClubsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Clubs</h2>
      <ul className="space-y-2">
        {clubs.map((club) => (
          <li key={club.id}>
            <Link
              href={`/clubs/${club.id}`}
              className="block p-3 rounded-lg bg-muted hover:bg-accent transition"
            >
              {club.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
