"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import type { BotMessage } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send } from "lucide-react"

interface BotChatViewProps {
  messages: BotMessage[]
  channel: string
}

const channelTitles = {
  "results-bot": "Results Bot",
  "jobs-bot": "Jobs & Internships Bot",
  "events-bot": "Events Bot",
  "ask-ai-bot": "Ask AI Assistant",
}

const placeholders = {
  "results-bot": "Ask about exam results, grades, or academic performance...",
  "jobs-bot": "Ask about job opportunities, internships, or career advice...",
  "events-bot": "Ask about upcoming events, schedules, or activities...",
  "ask-ai-bot": "Ask me anything about courses, campus, or general queries...",
}

export function BotChatView({ messages, channel }: BotChatViewProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message to bot:", newMessage)
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-background">
      {/* Bot Header */}
      <div className="px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {channelTitles[channel as keyof typeof channelTitles]}
            </h3>
            <p className="text-sm text-muted-foreground">Automated updates and assistance</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 w-full">
        <div className="px-4 py-4 w-full">
          <div className="space-y-6 w-full">
            {messages.length === 0 ? (
              <div className="text-center py-12 w-full">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-muted-foreground text-sm">No updates from this bot yet.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="w-full">
                  <div className="flex gap-3 group hover:bg-muted/10 p-3 rounded-lg transition-colors w-full">
                    <Avatar className="w-10 h-10 border-2 border-emerald-500/20 flex-shrink-0">
                      <AvatarImage src={message.bot.avatar || "/placeholder.svg"} alt={message.bot.name} />
                      <AvatarFallback className="bg-emerald-500/10">
                        <Bot className="w-5 h-5 text-emerald-500" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-sm text-foreground">{message.bot.name}</span>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                        >
                          BOT
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(message.timestamp, "MMM d, h:mm a")}
                        </span>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-4 w-full border border-emerald-200/30 dark:border-emerald-800/30">
                        <p className="text-sm leading-relaxed break-words w-full text-foreground/90">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Enhanced Bot Chat Input */}
      <div className="px-4 py-3 border-t border-border/40 bg-background">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholders[channel as keyof typeof placeholders] || "Ask the bot..."}
              className="pr-12 h-10 bg-muted/30 border-border/40 focus:bg-background focus:border-primary/40 transition-colors"
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
