"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  MapPin, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  User,
  Settings
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

type UserRole = "citizen" | "admin"

export default function UnifiedLoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { toast } = useToast()
  const { user, signIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const redirectTo = searchParams.get('redirectedFrom')
      if (redirectTo && redirectTo.startsWith('/')) {
        router.push(redirectTo as any)
      } else {
        // Redirect based on user role or default to citizen
        router.push("/citizen/dashboard")
      }
    }
  }, [user, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) {
      setError("Please select your role")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)
      if (error) throw error
      
      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting to your ${selectedRole} dashboard...`,
      })

      // Redirect based on selected role
      const redirectTo = searchParams.get('redirectedFrom')
      if (redirectTo && redirectTo.startsWith('/')) {
        router.push(redirectTo as any)
      } else {
        router.push(`/${selectedRole}/dashboard`)
      }
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.")
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!selectedRole) {
      setError("Please select your role")
      return
    }

    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
      
      toast({
        title: "Login Successful",
        description: `Welcome! Redirecting to your ${selectedRole} dashboard...`,
      })
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during Google login.",
        variant: "destructive",
      })
    }
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Select your role and sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Role Selection */}
            {!selectedRole ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">Choose Your Role</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => handleRoleSelect("citizen")}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">Citizen</div>
                      <div className="text-sm text-muted-foreground">
                        Report issues and track progress
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-purple-50 hover:border-purple-300"
                    onClick={() => handleRoleSelect("admin")}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">Administrator</div>
                      <div className="text-sm text-muted-foreground">
                        Manage issues and oversee operations
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Selected Role Display */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    {selectedRole === "citizen" ? (
                      <MapPin className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Shield className="w-5 h-5 text-purple-600" />
                    )}
                    <div>
                      <div className="font-medium capitalize">{selectedRole} Portal</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedRole === "citizen" 
                          ? "Report and track civic issues" 
                          : "Manage and resolve issues"
                        }
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                  >
                    Change
                  </Button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link
                    href={`/${selectedRole}/signup`}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
