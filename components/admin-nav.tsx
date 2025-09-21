"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// ✅ Correct imports for UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ✅ Correct supabase client import
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import {
    BarChart3,
    Bell,
    FileText,
    Settings,
    Shield,
    Users,
    LogOut,
  User,
  Flag,
  Menu,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import AdminNotifications from "@/components/admin-notifications";

// ✅ Final merged navigation items
const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/issues", label: "Manage Issues", icon: Settings },
  { href: "/admin/notifications", label: "Notifications", icon: Bell, badge: 5 },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/profile", label: "Profile", icon: User },
];

// Mobile menu items (additional items for mobile)
const mobileMenuItems = [
  { href: "/admin/crowdfunding", label: "₹ Funds", icon: DollarSign },
  { href: "/admin/abhiyaan", label: "Abhiyaan", icon: Flag },
];

// Page titles for breadcrumb
const getPageTitle = (pathname: string) => {
  const titles: { [key: string]: string } = {
    "/admin/dashboard": "Dashboard",
    "/admin/issues": "Manage Issues",
    "/admin/notifications": "Notifications",
    "/admin/reports": "Reports",
    "/admin/users": "Users",
    "/admin/profile": "Profile",
    "/admin/crowdfunding": "₹ Funds",
    "/admin/abhiyaan": "Abhiyaan",
  };
  
  return titles[pathname] || "Admin Panel";
};

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();
  const { signOut, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
    const handleLogout = async () => {
        await signOut();
    };

  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split("@")[0] || 
                     "Admin";

    return (
    <>
      {/* Main Navbar */}
      <div className="border-b bg-card sticky top-0 z-50 mobile-navbar">
        <div className="responsive-container py-3 mobile-navbar-container">
                <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/admin/dashboard" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-semibold text-base sm:text-lg">Admin Panel</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="h-9"
                    asChild
                  >
                    <Link href={item.href as any}>
                      {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                      {item.label}
                      {item.badge && (
                        <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                );
              })}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2">
              {/* Additional Desktop Buttons */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-foreground hover:bg-muted/50"
                  asChild
                >
                  <Link href="/admin/crowdfunding" className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="hidden xl:inline">₹ Funds</span>
                    <span className="xl:hidden">₹</span>
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-foreground hover:bg-muted/50"
                  asChild
                >
                  <Link href="/admin/abhiyaan" className="flex items-center">
                    <Flag className="w-4 h-4 mr-1" />
                    <span className="hidden xl:inline">Abhiyaan</span>
                    <span className="xl:hidden">Flag</span>
                  </Link>
                </Button>
              </div>

              {/* Notifications and Profile */}
              <div className="flex items-center space-x-2">
                <AdminNotifications />
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 bg-orange-500 hover:bg-orange-600 text-white px-4"
                  asChild
                >
                  <Link href="/admin/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span className="hidden xl:inline">{displayName}</span>
                    <span className="xl:hidden">Profile</span>
                  </Link>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden xl:inline">Logout</span>
              </Button>
            </div>

            {/* Mobile Navigation - Only Bell Icon and Hamburger Menu */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Notifications Bell Icon */}
              <AdminNotifications />
              
              {/* Hamburger Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50 transition-colors">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96 transition-all duration-300 ease-in-out">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-accent-foreground" />
                            </div>
                        <span className="font-semibold text-lg">Admin Panel</span>
                      </div>
                    </div>

                    {/* Main Navigation Items */}
                    <div className="flex-1">
                      <div className="space-y-2 mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground px-2">Navigation</h3>
                        {navItems.map((item) => {
                          const isActive = pathname === item.href;
                          const IconComponent = item.icon;

                          return (
                            <Button
                              key={item.href}
                              variant={isActive ? "default" : "ghost"}
                              className="w-full justify-start h-11 transition-all duration-200 mobile-menu-item"
                              asChild
                              onClick={() => setIsOpen(false)}
                            >
                              <Link href={item.href as any}>
                                {IconComponent && <IconComponent className="w-4 h-4 mr-3" />}
                                {item.label}
                                {item.badge && (
                                  <Badge variant="destructive" className="ml-auto px-1 py-0 text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            </Button>
                          );
                        })}
                      </div>

                      {/* Mobile Menu Items */}
                      <div className="space-y-2 mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground px-2">Additional</h3>
                        {mobileMenuItems.map((item) => {
                          const isActive = pathname === item.href;
                          const IconComponent = item.icon;
                          
                          return (
                            <Button
                              key={item.href}
                              variant={isActive ? "default" : "ghost"}
                              className="w-full justify-start h-11 transition-all duration-200 mobile-menu-item"
                              asChild
                              onClick={() => setIsOpen(false)}
                            >
                              <Link href={item.href as any}>
                                {IconComponent && <IconComponent className="w-4 h-4 mr-3" />}
                                {item.label}
                              </Link>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate text-sm">{displayName}</div>
                          <div className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-11 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Breadcrumb/Page Title */}
      <div className="lg:hidden border-b bg-muted/30 mobile-navbar-breadcrumb">
        <div className="responsive-container py-2 mobile-navbar-container">
          <div className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {getPageTitle(pathname)}
                            </span>
          </div>
        </div>
      </div>
    </>
  );
}