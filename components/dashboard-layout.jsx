"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  BarChart3,
  User,
  Shield,
  Crown,
  FileText,
  Bell,
  LogOut,
  MessageSquare,
  Settings,
  Play,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Play, label: "Player", href: "/dashboard/player" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: MessageSquare, label: "Request 👑", href: "/dashboard/request" },
  { icon: Crown, label: "Premium", href: "/dashboard/premium" },
  { icon: FileText, label: "Api documentation", href: "/dashboard/api-docs" },
]

const adminItems = [{ icon: Settings, label: "Admin Panel", href: "/dashboard/admin" }]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  const isAdmin = user?.role === "admin"

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <div>
              <div className="text-white text-xl font-bold">Uembed</div>
              <div className="text-slate-400 text-xs">Streaming For You</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
            {isAdmin && (
              <>
                <li className="pt-4">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 pb-2">
                    Administration
                  </div>
                </li>
                {adminItems.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive ? "bg-red-700 text-white" : "text-slate-400 hover:text-white hover:bg-red-700/50"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-white text-2xl font-semibold">
              {pathname === "/dashboard/profile" && "Profile"}
              {pathname === "/dashboard" && "Dashboard"}
              {pathname === "/dashboard/player" && "Player"}
              {pathname === "/dashboard/reports" && "Reports"}
              {pathname === "/dashboard/request" && "Request 👑"}
              {pathname === "/dashboard/premium" && "Premium"}
              {pathname === "/dashboard/api-docs" && "API Documentation"}
              {pathname.startsWith("/dashboard/admin") && "Admin Panel"}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-slate-400 text-sm">Jun 5 11:23 PM</div>
              <Button onClick={handleLogout} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
