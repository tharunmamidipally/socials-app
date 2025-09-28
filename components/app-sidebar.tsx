"use client"

import {
  Hash,
  Trophy,
  Megaphone,
  Calendar,
  Home,
  Bot,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Briefcase,
  CalendarDays,
  HelpCircle,
  PlusCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchSpaces } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { db } from "@/lib/firebase"
import { collection, addDoc, onSnapshot } from "firebase/firestore"

interface AppSidebarProps {
  activeChannel: string
  onChannelSelect: (channel: string) => void
  currentView: "chat" | "leaderboards"
  onViewChange: (view: "chat" | "leaderboards") => void
  currentSpace: string
  onSpaceChange: (space: string) => void
}

const channels = [
  { id: "welcome", name: "welcome", icon: Home },
  { id: "general", name: "general", icon: Hash },
  { id: "announcements", name: "announcements", icon: Megaphone },
]

const botChannels = [
  { id: "results-bot", name: "Results Bot", icon: BarChart3, description: "Exam results & scores" },
  { id: "jobs-bot", name: "Jobs Bot", icon: Briefcase, description: "Internships & careers" },
  { id: "events-bot", name: "Events Bot", icon: CalendarDays, description: "Calendar sync" },
  { id: "ask-ai-bot", name: "Ask AI", icon: HelpCircle, description: "Student queries" },
]

export function AppSidebar({
  activeChannel,
  onChannelSelect,
  currentView,
  onViewChange,
  currentSpace,
  onSpaceChange,
}: AppSidebarProps) {
  const { data: spaces } = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
  })

  const [showClubs, setShowClubs] = useState(false)
  const [openCreateClub, setOpenCreateClub] = useState(false)
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([])

  const [clubData, setClubData] = useState({
    name: "",
    president: "",
    email: "",
    mobile: "",
  })

  // --- Load clubs from Firestore ---
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "clubs"), (snapshot) => {
      const list = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: (doc.data() as any).name || "",
        }))
        .filter((club) => club.name.trim() !== "") // ✅ filter out empty names
      setClubs(list)
    })
    return () => unsub()
  }, [])

  // --- Create new club in Firestore ---
  const handleCreateClub = async () => {
    if (!clubData.name || !clubData.president || !clubData.email || !clubData.mobile) {
      return alert("Please fill in all fields")
    }
    try {
      await addDoc(collection(db, "clubs"), {
        name: clubData.name.trim(),
        president: clubData.president,
        email: clubData.email,
        mobile: clubData.mobile,
        createdAt: new Date(),
      })
      setOpenCreateClub(false)
      setClubData({ name: "", president: "", email: "", mobile: "" })
      alert("✅ Club created successfully!")
    } catch (err) {
      console.error(err)
      alert("❌ Failed to create club")
    }
  }

  const currentSpaceData = spaces?.find((space) => space.id === currentSpace)

  return (
    <>
      <Sidebar className="border-r border-border/40 bg-background">
        {/* HEADER */}
        <SidebarHeader className="border-b border-border/40 p-4 bg-background">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">Socials</h1>
              <p className="text-xs text-muted-foreground">Connect. Compete. Grow.</p>
            </div>
          </div>

          {/* SPACE SELECTOR */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-border/40">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currentSpaceData?.icon || "🏛️"}</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">{currentSpaceData?.name || "IIT Delhi"}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentSpaceData?.memberCount || 2340} members
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
              {spaces?.map((space) => (
                <DropdownMenuItem
                  key={space.id}
                  onClick={() => onSpaceChange(space.id)}
                  className="flex items-center gap-3 p-3"
                >
                  <span className="text-xl">{space.icon}</span>
                  <div>
                    <p className="font-medium">{space.name}</p>
                    <p className="text-xs text-muted-foreground">{space.memberCount} members</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>

        <SidebarContent className="bg-background">
          {/* CHANNELS */}
          <SidebarGroup>
            <SidebarGroupLabel>Channels</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {channels.map((channel) => (
                  <SidebarMenuItem key={channel.id}>
                    <SidebarMenuButton
                      isActive={currentView === "chat" && activeChannel === channel.id}
                      onClick={() => {
                        onViewChange("chat")
                        onChannelSelect(channel.id)
                      }}
                      className="w-full justify-start"
                    >
                      <channel.icon className="w-4 h-4" />
                      <span>#{channel.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <div className="flex items-center w-full">
                    <SidebarMenuButton
                      isActive={activeChannel === "events"}
                      onClick={() => {
                        onViewChange("chat")
                        onChannelSelect("events")
                      }}
                      className="flex-1 justify-start"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{activeChannel === "general" ? "#all-club-events" : "#events"}</span>
                    </SidebarMenuButton>
                    {(activeChannel === "music" || activeChannel === "tech" || activeChannel === "sports") && (
                      <button
                        onClick={() => alert(`Create event for ${activeChannel} club`)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* CLUBS */}
          <SidebarGroup>
            <SidebarGroupLabel>Clubs</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setShowClubs(!showClubs)}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>#clubs</span>
                    </div>
                    {showClubs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <AnimatePresence>
                  {showClubs && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {clubs.map((club) => (
                        <SidebarMenuItem key={club.id} className="ml-6">
                          <SidebarMenuButton
                            onClick={() => {
                              onViewChange("chat")
                              onChannelSelect(club.name)
                            }}
                            isActive={activeChannel === club.name}
                            className="w-full justify-start text-sm"
                          >
                            #{club.name}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}

                      <SidebarMenuItem className="ml-6">
                        <SidebarMenuButton
                          onClick={() => setOpenCreateClub(true)}
                          className="w-full justify-start text-emerald-600 font-medium"
                        >
                          ➕ Create a Club
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* BOTS */}
          <SidebarGroup>
            <SidebarGroupLabel>Smart Bots</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {botChannels.map((bot) => (
                  <SidebarMenuItem key={bot.id}>
                    <SidebarMenuButton
                      isActive={currentView === "chat" && activeChannel === bot.id}
                      onClick={() => {
                        onViewChange("chat")
                        onChannelSelect(bot.id)
                      }}
                      className="w-full justify-start h-auto py-2 px-3"
                    >
                      <Bot className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <div className="flex flex-col items-start gap-0.5 ml-2">
                        <span className="text-sm font-medium leading-tight">{bot.name}</span>
                        <span className="text-xs text-muted-foreground leading-tight">
                          {bot.description}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* CREATE CLUB MODAL */}
      <Dialog open={openCreateClub} onOpenChange={setOpenCreateClub}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Club</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Club Name"
              value={clubData.name}
              onChange={(e) => setClubData({ ...clubData, name: e.target.value })}
            />
            <Input
              placeholder="Club President Name"
              value={clubData.president}
              onChange={(e) => setClubData({ ...clubData, president: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={clubData.email}
              onChange={(e) => setClubData({ ...clubData, email: e.target.value })}
            />
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={clubData.mobile}
              onChange={(e) => setClubData({ ...clubData, mobile: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreateClub(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClub} className="bg-emerald-600 text-white hover:bg-emerald-700">
              Create Club
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
