"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Plus, FileText, Bell, Trophy, User, LogOut } from "lucide-react"
import NotificationSystem from "@/components/notification-system"

const navItems = [
  {
    href: "/citizen/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/citizen/report",
    label: "Report Issue",
    icon: Plus,
  },
  {
    href: "/citizen/my-issues",
    label: "My Issues",
    icon: FileText,
  },
  {
    href: "/citizen/notifications",
    label: "Notifications",
    icon: Bell,
    badge: 3, // Unread count
  },
  {
    href: "/citizen/leaderboard",
    label: "Leaderboard",
    icon: Trophy,
  },
]

export default function CitizenNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/citizen/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-semibold text-lg">CivicReport</span>
            </Link>

            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className="relative"
                  >
                    <Link href={item.href}>
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {item.badge && (
                        <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationSystem />

            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
