"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          toast({
            title: "Login Failed",
            description: data.error || "Unknown error.",
            variant: "destructive",
          });
          return;
        }
        if (data.user?.role !== "admin") {
          toast({
            title: "Access Denied",
            description: "You are not an admin.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard. Redirecting...",
        });
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      })
      .catch(() => {
        toast({
          title: "Login Failed",
          description: "Network error. Please try again.",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-accent mr-2" />
            <h1 className="text-2xl font-bold">Civic Platform</h1>
          </div>
          <h2 className="text-xl text-muted-foreground">Admin Portal</h2>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Administrator Access</CardTitle>
            <CardDescription>Sign in to manage civic issues and municipal operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Sign In to Admin Panel
              </Button>
            </form>

            <div className="text-center">
              <Link href="/admin/forgot-password" className="text-sm text-muted-foreground hover:text-accent">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-2">
          <Link href="/" className="block text-sm text-muted-foreground hover:text-accent">
            ← Back to Home
          </Link>
          <div className="text-xs text-muted-foreground">Need admin access? Contact your system administrator.</div>
        </div>
      </div>
    </div>
  )
}
