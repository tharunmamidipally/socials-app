"use client"

import { useEffect, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import MainPanel from "@/components/main-panel"
import { LeaderboardsPage } from "@/components/leaderboards-page"
import { StudentProfile } from "@/components/student-profile"
import LandingPage from "@/components/landing-page"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function Home() {
  const auth = getAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeChannel, setActiveChannel] = useState("welcome")
  const [currentView, setCurrentView] = useState<"chat" | "leaderboards" | "profile">("chat")
  const [currentSpace, setCurrentSpace] = useState("iit-delhi")
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [auth])

  const handleProfileClick = (studentId: string) => {
    setSelectedStudentId(studentId)
    setCurrentView("profile")
  }

  const handleBackFromProfile = () => {
    setCurrentView("chat")
    setSelectedStudentId(null)
  }

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

  // If user is not logged in → show LandingPage
  if (!user) {
    return <LandingPage onEnterPlatform={() => {}} />
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar
          activeChannel={activeChannel}
          onChannelSelect={setActiveChannel}
          currentView={currentView}
          onViewChange={(view) => {
            if (view !== "profile") {
              setCurrentView(view)
              setSelectedStudentId(null)
            }
          }}
          currentSpace={currentSpace}
          onSpaceChange={setCurrentSpace}
        />
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <TopBar />
          <div className="flex-1 w-full overflow-hidden">
            {currentView === "chat" ? (
              <MainPanel
                activeChannel={activeChannel}
                currentSpace={currentSpace}
                onProfileClick={handleProfileClick}
              />
            ) : currentView === "leaderboards" ? (
              <LeaderboardsPage />
            ) : currentView === "profile" && selectedStudentId ? (
              <StudentProfile studentId={selectedStudentId} onBack={handleBackFromProfile} />
            ) : null}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
