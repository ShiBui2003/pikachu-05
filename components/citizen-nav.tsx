"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Home,
    Plus,
    FileText,
    Bell,
    Trophy,
    User,
    LogOut,
    Menu,
    CheckCircle,
} from "lucide-react";
import RealTimeNotifications from "@/components/real-time-notifications";
import { useIsMobile } from "@/hooks/use-mobile";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-utils";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
        href: "/citizen/resolved",
        label: "Resolved Issues",
        icon: CheckCircle,
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
];

export default function CitizenNav() {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const displayName =
        (user?.user_metadata as any)?.full_name ||
        (user?.user_metadata as any)?.name ||
        (user?.email ? String(user.email).split("@")[0] : undefined) ||
        "Profile";

    const NavItems = ({
        mobile = false,
        onItemClick,
    }: {
        mobile?: boolean;
        onItemClick?: () => void;
    }) => (
        <nav
            className={
                mobile
                    ? "flex flex-col space-y-2"
                    : "hidden lg:flex lg:items-center lg:space-x-1"
            }
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Button
                        key={item.href}
                        variant={isActive ? "default" : "ghost"}
                        size={mobile ? "default" : "sm"}
                        asChild
                        className={`relative ${
                            mobile ? "w-full justify-start h-11" : "h-9"
                        }`}
                        onClick={onItemClick}
                    >
                        <Link href={item.href as any}>
                            <Icon className="w-4 h-4 mr-2" />
                            {item.label}
                            {item.badge && (
                                <Badge
                                    variant="destructive"
                                    className="ml-auto px-1 py-0 text-xs"
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </Link>
                    </Button>
                );
            })}
        </nav>
    );

    // Add Supabase logout logic
    const handleLogout = async () => {
        try {
            // Clear any cached data first
            const supabase = createClient();
            await supabase.auth.signOut();
            
            // Clear local storage and session storage
            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
                
                // Clear all cookies
                document.cookie.split(";").forEach((c) => {
                    const eqPos = c.indexOf("=");
                    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                });
                
                // Force redirect to citizen login
                window.location.href = '/citizen/login';
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Force redirect even if there's an error
            if (typeof window !== 'undefined') {
                window.location.href = '/citizen/login';
            }
        }
    };

    return (
        <div className="border-b bg-card sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo - Always visible */}
                    <Link
                        href="/citizen/dashboard"
                        className="flex items-center space-x-2"
                    >
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <span className="font-semibold text-base sm:text-lg">
                            CivicReport
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <NavItems />

                    {/* Desktop User Actions */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-2">
                        <RealTimeNotifications />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-9">
                                    <Avatar className="w-6 h-6 mr-2">
                                        <AvatarFallback>
                                            {String(displayName).substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {displayName}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                <DropdownMenuLabel>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9">
                                            <AvatarFallback>
                                                {String(displayName).substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <div className="font-medium truncate">{displayName}</div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {user?.email ?? ""}
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/citizen/profile">
                                        <User className="w-4 h-4 mr-2" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/citizen/my-issues">
                                        <FileText className="w-4 h-4 mr-2" />
                                        My Issues
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/citizen/notifications">
                                        <Bell className="w-4 h-4 mr-2" />
                                        Notifications
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex lg:hidden items-center space-x-2">
                        <RealTimeNotifications />
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 w-9 p-0"
                                >
                                    <User className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                                <Home className="w-5 h-5 text-accent-foreground" />
                                            </div>
                                            <span className="font-semibold text-lg">
                                                CivicReport
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <NavItems
                                            mobile
                                            onItemClick={() => setIsOpen(false)}
                                        />
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                            <Avatar className="w-9 h-9">
                                                <AvatarFallback>
                                                    {String(displayName).substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="font-medium truncate">{displayName}</div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {user?.email ?? ""}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start h-11"
                                            asChild
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link href="/citizen/profile">
                                                <User className="w-4 h-4 mr-2" />
                                                Profile
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start h-11"
                                            asChild
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link href="/citizen/my-issues">
                                                <FileText className="w-4 h-4 mr-2" />
                                                My Issues
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start h-11"
                                            asChild
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link href="/citizen/notifications">
                                                <Bell className="w-4 h-4 mr-2" />
                                                Notifications
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>
    );
}
