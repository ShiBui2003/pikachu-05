"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  UserPlus,
  LogIn,
  Sparkles,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

type UserRole = "citizen" | "admin"
type AuthMode = "signin" | "signup"

export default function UnifiedAuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("signin")
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { toast } = useToast()
  const { user, signIn, signUp, signInWithGoogle, signUpWithGoogle } = useAuth()
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
        const userRole = user.user_metadata?.role || 'citizen'
        const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'
        router.push(dashboardPath)
      }
    }
  }, [user, router, searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (authMode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      if (authMode === "signin") {
        const { error } = await signIn(formData.email, formData.password, selectedRole)
        if (error) throw error
        
        toast({
          title: "Login Successful",
          description: `Welcome back! Redirecting to your ${selectedRole} dashboard...`,
        })
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          role: selectedRole
        })
        if (error) throw error
        
        toast({
          title: "Account Created Successfully!",
          description: `Welcome! Please check your email to verify your account.`,
        })
        router.push(`/${selectedRole}/signup-success`)
        return
      }

      // Redirect based on selected role for signin
      const redirectTo = searchParams.get('redirectedFrom')
      if (redirectTo && redirectTo.startsWith('/')) {
        router.push(redirectTo as any)
      } else {
        router.push(`/${selectedRole}/dashboard`)
      }
    } catch (error: any) {
      setError(error.message || `${authMode === "signin" ? "Login" : "Sign up"} failed. Please try again.`)
      toast({
        title: `${authMode === "signin" ? "Login" : "Sign Up"} Failed`,
        description: error.message || `An error occurred during ${authMode === "signin" ? "login" : "sign up"}.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const { error } = authMode === "signin" 
        ? await signInWithGoogle(selectedRole)
        : await signUpWithGoogle({ role: selectedRole })
      
      if (error) throw error
      
      toast({
        title: `${authMode === "signin" ? "Login" : "Sign Up"} Successful`,
        description: `Welcome! Redirecting to your ${selectedRole} dashboard...`,
      })
    } catch (error: any) {
      toast({
        title: `Google ${authMode === "signin" ? "Login" : "Sign Up"} Failed`,
        description: error.message || `An error occurred during Google ${authMode === "signin" ? "login" : "sign up"}.`,
        variant: "destructive",
      })
    }
  }

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === "signin" ? "signup" : "signin")
    setError(null)
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: ""
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="w-full max-w-lg relative z-10">
        {/* Back to Home */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {authMode === "signin" ? "Welcome Back" : "Join Our Community"}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              {authMode === "signin" 
                ? "Sign in to continue your civic journey" 
                : "Make a difference in your community"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8">
            {/* Auth Mode Toggle */}
            <div className="flex bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-1 border border-blue-100">
              <Button
                variant={authMode === "signin" ? "default" : "ghost"}
                size="sm"
                className={`flex-1 transition-all duration-200 ${
                  authMode === "signin" 
                    ? "bg-white shadow-md text-blue-600" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setAuthMode("signin")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button
                variant={authMode === "signup" ? "default" : "ghost"}
                size="sm"
                className={`flex-1 transition-all duration-200 ${
                  authMode === "signup" 
                    ? "bg-white shadow-md text-purple-600" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setAuthMode("signup")}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-semibold text-foreground">
                Choose Your Role
              </Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl">
                  <SelectItem value="citizen" className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Citizen</div>
                        <div className="text-xs text-muted-foreground">Report and track civic issues</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin" className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Administrator</div>
                        <div className="text-xs text-muted-foreground">Manage and resolve issues</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {/* Role Badge */}
              <div className="flex justify-center">
                <Badge 
                  variant="secondary" 
                  className={`px-3 py-1 ${
                    selectedRole === "citizen" 
                      ? "bg-blue-100 text-blue-700 border-blue-200" 
                      : "bg-purple-100 text-purple-700 border-purple-200"
                  }`}
                >
                  {selectedRole === "citizen" ? (
                    <>
                      <MapPin className="w-3 h-3 mr-1" />
                      Citizen Portal
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3 mr-1" />
                      Admin Portal
                    </>
                  )}
                </Badge>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {authMode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold text-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="pl-12 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                      required={authMode === "signup"}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={authMode === "signin" ? "Enter your password" : "Create a strong password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-12 pr-12 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {authMode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-12 pr-12 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                      required={authMode === "signup"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                  authMode === "signin"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                } shadow-lg hover:shadow-xl`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {authMode === "signin" ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {authMode === "signin" ? (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-muted-foreground font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center text-sm pt-4">
              <span className="text-muted-foreground">
                {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Button
                variant="link"
                className="p-0 h-auto text-primary hover:underline font-semibold"
                onClick={toggleAuthMode}
              >
                {authMode === "signin" ? "Sign up" : "Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
