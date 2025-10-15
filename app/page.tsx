"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import MainPanel from "@/components/main-panel"
import { LeaderboardsPage } from "@/components/leaderboards-page"
import { StudentProfile } from "@/components/student-profile"
import { UserProfile } from "@/components/user-profile"
import LandingPage from "@/components/landing-page"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function Home() {
  const auth = getAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeChannel, setActiveChannel] = useState("welcome")
  const [currentView, setCurrentView] = useState<"chat" | "leaderboards" | "profile" | "user-profile">("chat")
  const [currentSpace, setCurrentSpace] = useState("iit-delhi")
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [auth])

  const handleStudentProfileClick = (studentId: string) => {
    setSelectedStudentId(studentId)
    setCurrentView("profile")
  }

  const handleBackFromProfile = () => {
    setCurrentView("chat")
    setSelectedStudentId(null)
  }

  const handleUserProfileClick = () => {
    setCurrentView("user-profile")
  }

  const handleBackFromUserProfile = () => {
    setCurrentView("chat")
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
            if (view !== "profile" && view !== "user-profile") {
              setCurrentView(view)
              setSelectedStudentId(null)
            }
          }}
          currentSpace={currentSpace}
          onSpaceChange={setCurrentSpace}
        />
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <TopBar onProfileClick={handleUserProfileClick} />
          <div className="flex-1 w-full overflow-hidden">
            {currentView === "chat" ? (
              <MainPanel
                activeChannel={activeChannel}
              />
            ) : currentView === "leaderboards" ? (
              <LeaderboardsPage />
            ) : currentView === "profile" && selectedStudentId ? (
              <StudentProfile studentId={selectedStudentId} onBack={handleBackFromProfile} />
            ) : currentView === "user-profile" ? (
              <UserProfile onBack={handleBackFromUserProfile} />
            ) : null}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
