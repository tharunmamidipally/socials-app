"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import type { Message } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus, Shield, Crown } from "lucide-react"

interface ChatViewProps {
  messages: Message[]
  channel: string
  onProfileClick?: (studentId: string) => void
}

export function ChatView({ messages, channel, onProfileClick }: ChatViewProps) {
  const [newMessage, setNewMessage] = useState("")

  const channelTitles = {
    welcome: "Welcome",
    general: "General Discussion",
    announcements: "Announcements",
    events: "Events",
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleProfileClick = (userId: string) => {
    if (onProfileClick) {
      onProfileClick(userId)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-3.5 h-3.5 text-yellow-500" />
      case "moderator":
        return <Shield className="w-3.5 h-3.5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-background">
      {/* Channel Header */}
      <div className="px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h3 className="font-semibold text-lg text-foreground">#{channel}</h3>
        <p className="text-sm text-muted-foreground">{channelTitles[channel as keyof typeof channelTitles]}</p>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 w-full">
        <div className="px-4 py-4 w-full">
          <div className="space-y-4 w-full max-w-none">
            {messages.length === 0 ? (
              <div className="text-center py-12 w-full">
                <div className="text-4xl mb-3">👋</div>
                <p className="text-muted-foreground text-sm">No messages yet. Be the first to say hello!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const prevMessage = index > 0 ? messages[index - 1] : null
                const isSameUser = prevMessage?.user.id === message.user.id
                const timeDiff = prevMessage ? message.timestamp.getTime() - prevMessage.timestamp.getTime() : 0
                const showAvatar = !isSameUser || timeDiff > 5 * 60 * 1000 // 5 minutes

                return (
                  <div key={message.id} className="w-full max-w-none">
                    <div className="group hover:bg-muted/10 px-3 py-2 rounded-lg transition-colors w-full">
                      <div className="flex gap-3 w-full">
                        {/* Avatar Column */}
                        <div className="w-10 flex justify-center flex-shrink-0">
                          {showAvatar ? (
                            <button
                              onClick={() => handleProfileClick(message.user.id)}
                              className="hover:opacity-80 transition-opacity"
                            >
                              <Avatar className="w-10 h-10 border-2 border-border/20 hover:border-border/40 transition-colors">
                                <AvatarImage src={message.user.avatar || "/placeholder.svg"} alt={message.user.name} />
                                <AvatarFallback className="text-sm font-medium">
                                  {message.user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </button>
                          ) : (
                            <div className="w-10 h-6 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                {format(message.timestamp, "HH:mm")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 min-w-0 w-full max-w-none">
                          {showAvatar && (
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                onClick={() => handleProfileClick(message.user.id)}
                                className="font-semibold text-sm hover:underline text-foreground"
                              >
                                {message.user.name}
                              </button>
                              {getRoleIcon(message.user.role)}
                              <span className="text-xs text-muted-foreground">
                                {format(message.timestamp, "MMM d, h:mm a")}
                              </span>
                            </div>
                          )}
                          <div className="bg-muted/40 rounded-2xl px-4 py-2.5 border border-border/20 inline-block max-w-full">
                            <p className="text-sm leading-relaxed break-words text-foreground/90">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Enhanced Chat Input */}
      <div className="px-4 py-3 border-t border-border/40 bg-background">
        <div className="flex gap-3 items-end max-w-none">
          <Button variant="ghost" size="icon" className="flex-shrink-0 h-10 w-10 rounded-full hover:bg-muted">
            <Plus className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${channel}`}
              className="pr-12 h-10 bg-muted/30 border-border/40 focus:bg-background focus:border-primary/40 transition-colors resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 rounded-md"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
