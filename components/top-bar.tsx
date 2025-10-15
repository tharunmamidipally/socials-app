"use client"

import { Moon, Sun, User, LogOut, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { getAuth, signOut } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TopBarProps {
  onProfileClick?: () => void
}

export function TopBar({ onProfileClick }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const auth = getAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      window.location.href = "/" // redirect to login page after sign out
    } catch (error) {
      console.error("Sign-out failed:", error)
    }
  }

  if (!mounted) {
    return (
      <header className="flex items-center justify-between p-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Socials</h1>
            </div>
          </div>
          <div className="hidden md:block">
            <h2 className="font-semibold text-lg">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome back to your community</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9" />
          <div className="w-9 h-9" />
        </div>
      </header>
    )
  }

  return (
    <header className="flex items-center justify-between p-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />

        {/* Mobile Logo */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Socials</h1>
          </div>
        </div>

        {/* Desktop Title */}
        <div className="hidden md:block">
          <h2 className="font-semibold text-lg">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Welcome back to your community</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/big-smile/svg?seed=current-user" alt="Profile" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" /> Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
