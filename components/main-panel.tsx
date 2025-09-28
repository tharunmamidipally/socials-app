"use client"

import { useEffect, useRef, useState } from "react"
import {
  collection,
  collectionGroup,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { getAuth, signOut } from "firebase/auth"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, LogOut, Trash2 } from "lucide-react"

export default function MainPanel({ activeChannel }: { activeChannel: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showEvents, setShowEvents] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDate, setNewEventDate] = useState("")
  const [newEventTime, setNewEventTime] = useState("")
  const [showScrollButton, setShowScrollButton] = useState(false)

  const auth = getAuth()
  const scrollRef = useRef<HTMLDivElement>(null)

  // ✅ Reset events panel when channel changes
  useEffect(() => {
    setShowEvents(false)
  }, [activeChannel])

  // 📥 Load messages
  useEffect(() => {
    if (!activeChannel) return
    const q = query(
      collection(db, `messages/${activeChannel}/items`),
      orderBy("timestamp", "asc")
    )
    const unsub = onSnapshot(q, (snapshot) => {
      const newMsgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setMessages(newMsgs)

      // Auto-scroll if user is near bottom
      const area = scrollRef.current
      if (area) {
        const atBottom =
          area.scrollHeight - area.scrollTop - area.clientHeight < 100
        if (atBottom) {
          setTimeout(() => (area.scrollTop = area.scrollHeight), 50)
        }
      }
    })
    return () => unsub()
  }, [activeChannel])

  // 📅 Load events (live for general + per club)
  useEffect(() => {
    if (!activeChannel) return
    let unsub: () => void

    if (activeChannel === "general") {
      const q = query(collectionGroup(db, "items"), orderBy("date", "asc"))
      unsub = onSnapshot(q, (snapshot) => {
        let evs = snapshot.docs.map((doc) => ({
          id: doc.id,
          club: doc.ref.parent.parent?.id,
          ...doc.data(),
        }))
        const now = Date.now() / 1000
        evs = evs.filter((ev) => ev.date?.seconds && ev.date.seconds >= now)
        setEvents(evs)
      })
    } else {
      const q = query(
        collection(db, `events/${activeChannel}/items`),
        orderBy("date", "asc")
      )
      unsub = onSnapshot(q, (snapshot) => {
        let evs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const now = Date.now() / 1000
        evs = evs.filter((ev) => ev.date?.seconds && ev.date.seconds >= now)
        setEvents(evs)
      })
    }

    return () => unsub && unsub()
  }, [activeChannel])

  // 📍 Watch scroll to show/hide scroll button
  useEffect(() => {
    const area = scrollRef.current
    if (!area) return

    const handleScroll = () => {
      const atBottom =
        area.scrollHeight - area.scrollTop - area.clientHeight < 80
      setShowScrollButton(!atBottom)
    }

    area.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => area.removeEventListener("scroll", handleScroll)
  }, [])

  // 📤 Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    await addDoc(collection(db, `messages/${activeChannel}/items`), {
      text: newMessage,
      sender:
        auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous",
      uid: auth.currentUser?.uid,
      timestamp: serverTimestamp(),
    })
    setNewMessage("")
  }

  // 📤 Create event with date+time
  const createEvent = async () => {
    if (!newEventTitle.trim() || !newEventDate || !newEventTime) return
    const [hours, minutes] = newEventTime.split(":").map(Number)
    const eventDateTime = new Date(newEventDate)
    eventDateTime.setHours(hours, minutes, 0, 0)

    if (eventDateTime < new Date()) {
      alert("Cannot create event in the past.")
      return
    }

    await addDoc(collection(db, `events/${activeChannel}/items`), {
      title: newEventTitle,
      date: Timestamp.fromDate(eventDateTime),
      createdAt: serverTimestamp(),
    })

    setNewEventTitle("")
    setNewEventDate("")
    setNewEventTime("")
  }

  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, `events/${activeChannel}/items/${id}`))
  }

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate()
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      window.location.href = "/" // redirect to landing/login page
    } catch (err) {
      console.error("Sign out failed", err)
    }
  }

  return (
    <div className="flex flex-col h-full p-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold capitalize">{activeChannel}</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEvents(!showEvents)}
          >
            {showEvents ? "Hide Events" : "Show Events"}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            title="Sign Out"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Events Panel */}
      {showEvents ? (
        <Card className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-semibold text-lg mb-2">
            {activeChannel === "general"
              ? "All Upcoming Club Events"
              : `Upcoming Events – ${activeChannel}`}
          </h3>

          {activeChannel !== "general" && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
              <Input
                type="date"
                value={newEventDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNewEventDate(e.target.value)}
              />
              <Input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
              />
              <Button onClick={createEvent}>Create</Button>
            </div>
          )}

          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events available.
            </p>
          ) : activeChannel === "general" ? (
            <div className="space-y-4">
              {Object.entries(
                events.reduce((acc: any, ev: any) => {
                  const club = ev.club || "unknown"
                  if (!acc[club]) acc[club] = []
                  acc[club].push(ev)
                  return acc
                }, {})
              ).map(([club, evs]) => (
                <div key={club}>
                  <h4 className="text-md font-semibold mb-2">#{club}</h4>
                  <ul className="space-y-2">
                    {(evs as any[]).map((ev) => (
                      <li
                        key={ev.id}
                        className="p-2 rounded-md bg-muted flex justify-between items-center"
                      >
                        <div>{ev.title} — {formatDateTime(ev.date)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {events.map((ev) => (
                <li
                  key={ev.id}
                  className="p-2 rounded-md bg-muted flex justify-between items-center"
                >
                  <div>{ev.title} — {formatDateTime(ev.date)}</div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteEvent(ev.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : (
        // Chat Section
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-hidden p-0">
            <div
              ref={scrollRef}
              className="h-full overflow-y-auto px-4 py-3 space-y-3"
            >
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg) => {
                  const isCurrentUser = msg.uid === auth.currentUser?.uid
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isCurrentUser ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground mb-1">
                        {isCurrentUser ? "You" : msg.sender}
                      </span>
                      <span
                        className={`rounded-2xl px-4 py-2 max-w-[70%] break-words ${
                          isCurrentUser
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {msg.text}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {msg.timestamp
                          ? new Date(
                              msg.timestamp.seconds * 1000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>

          <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${activeChannel}`}
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </Card>
      )}

      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="fixed bottom-24 right-6 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ArrowDown className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
