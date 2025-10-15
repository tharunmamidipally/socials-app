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
import { ArrowDown, Trash2, Paperclip, MapPin, BarChart3, Plus, X, Calendar } from "lucide-react"

export default function MainPanel({ activeChannel }: { activeChannel: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showEvents, setShowEvents] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDate, setNewEventDate] = useState("")
  const [newEventTime, setNewEventTime] = useState("")
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showMessageOptions, setShowMessageOptions] = useState(false)
  const [pollOptions, setPollOptions] = useState<string[]>([])
  const [newPollOption, setNewPollOption] = useState("")
  const [pollQuestion, setPollQuestion] = useState("")

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
        evs = evs.filter((ev: any) => ev.date?.seconds && ev.date.seconds >= now)
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
        evs = evs.filter((ev: any) => ev.date?.seconds && ev.date.seconds >= now)
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

  const addPollOption = () => {
    if (newPollOption.trim() && pollOptions.length < 6) {
      setPollOptions([...pollOptions, newPollOption.trim()])
      setNewPollOption("")
    }
  }

  const removePollOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index))
  }

  const createPoll = async () => {
    if (!pollQuestion.trim() || pollOptions.length < 2) return

    await addDoc(collection(db, `messages/${activeChannel}/items`), {
      text: `📊 Poll: ${pollQuestion}`,
      sender: auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous",
      uid: auth.currentUser?.uid,
      timestamp: serverTimestamp(),
      type: "poll",
      pollQuestion: pollQuestion,
      pollOptions: pollOptions,
      pollVotes: {}
    })

    setPollQuestion("")
    setPollOptions([])
    setShowMessageOptions(false)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // For now, just show a message about file upload
    await addDoc(collection(db, `messages/${activeChannel}/items`), {
      text: `📎 Uploaded file: ${file.name}`,
      sender: auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous",
      uid: auth.currentUser?.uid,
      timestamp: serverTimestamp(),
      type: "file",
      fileName: file.name,
      fileSize: file.size
    })
  }

  const shareLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        await addDoc(collection(db, `messages/${activeChannel}/items`), {
          text: `📍 Shared location`,
          sender: auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous",
          uid: auth.currentUser?.uid,
          timestamp: serverTimestamp(),
          type: "location",
          latitude: latitude,
          longitude: longitude
        })
        setShowMessageOptions(false)
      })
    }
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


  return (
    <div className="flex flex-col h-full p-2 sm:p-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg sm:text-xl font-bold capitalize truncate">{activeChannel}</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowEvents(!showEvents)}
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline">{showEvents ? "Hide Events" : "Show Events"}</span>
          <span className="sm:hidden">{showEvents ? "Hide" : "Events"}</span>
        </Button>
      </div>

      {/* Events Panel */}
      {showEvents ? (
        <Card className="flex-1 p-2 sm:p-4 overflow-y-auto">
          <h3 className="font-semibold text-base sm:text-lg mb-2">
            {activeChannel === "general"
              ? "All Upcoming Club Events"
              : `Upcoming Events – ${activeChannel}`}
          </h3>

          {activeChannel !== "general" && (
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                placeholder="Event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newEventDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Button onClick={createEvent} className="w-full sm:w-auto">Create</Button>
            </div>
          )}

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No events available.</p>
            </div>
          ) : activeChannel === "general" ? (
            <div className="space-y-6">
              {Object.entries(
                events.reduce((acc: any, ev: any) => {
                  const club = ev.club || "unknown"
                  if (!acc[club]) acc[club] = []
                  acc[club].push(ev)
                  return acc
                }, {})
              ).map(([club, evs]) => (
                <div key={club}>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">#{club}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(evs as any[]).map((ev) => (
                      <Card key={ev.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/40">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {ev.title}
                            </h5>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {formatDateTime(ev.date)}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>Club Event</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => (
                <Card key={ev.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/40">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h5 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {ev.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatDateTime(ev.date)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>#{activeChannel}</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteEvent(ev.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                        className={`rounded-2xl px-3 sm:px-4 py-2 max-w-[85%] sm:max-w-[70%] break-words text-sm sm:text-base ${
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

          <form onSubmit={sendMessage} className="border-t">
            {/* Message Options Dropdown */}
            {showMessageOptions && (
              <div className="p-3 border-b bg-muted/30">
                <div className="space-y-3">
                  {/* Poll Creation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Create Poll</label>
                    <Input
                      placeholder="Poll question"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add option"
                        value={newPollOption}
                        onChange={(e) => setNewPollOption(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addPollOption()}
                        className="text-sm flex-1"
                      />
                      <Button type="button" onClick={addPollOption} size="sm" variant="outline">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    {pollOptions.length > 0 && (
                      <div className="space-y-1">
                        {pollOptions.map((option, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="flex-1 bg-background p-2 rounded border">{option}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePollOption(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      onClick={createPoll}
                      disabled={!pollQuestion.trim() || pollOptions.length < 2}
                      size="sm"
                      className="w-full"
                    >
                      Create Poll
                    </Button>
                  </div>

                  {/* Other Options */}
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                      />
                      <Button type="button" variant="outline" size="sm" className="w-full">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Upload File
                      </Button>
                    </label>
                    <Button type="button" variant="outline" size="sm" onClick={shareLocation}>
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="flex gap-2 p-2 sm:p-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowMessageOptions(!showMessageOptions)}
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${activeChannel}`}
                className="flex-1 text-sm sm:text-base"
              />
              <Button type="submit" size="sm" className="px-3 sm:px-4">Send</Button>
            </div>
          </form>
        </Card>
      )}

      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 sm:w-12 sm:h-12"
        >
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      )}
    </div>
  )
}
