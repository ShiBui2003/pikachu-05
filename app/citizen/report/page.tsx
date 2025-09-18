"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Upload, Camera, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location_address: "",
    location_lat: "",
    location_lng: "",
    image_url: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      router.push('/citizen/login')
    }
  }, [user, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `issue-images/${fileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Issue reported successfully",
          description: "Your issue has been submitted and will be reviewed by our team."
        })
        router.push('/citizen/dashboard')
      } else {
        throw new Error(data.error || 'Failed to submit issue')
      }
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit issue. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location_lat: position.coords.latitude.toString(),
            location_lng: position.coords.longitude.toString()
          }))
          toast({
            title: "Location detected",
            description: "Your current location has been added to the issue."
          })
        },
        (error) => {
          toast({
            title: "Location access denied",
            description: "Please enter your location manually.",
            variant: "destructive"
          })
        }
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
            <p className="text-muted-foreground">
              Help improve your community by reporting issues that need attention
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
              <CardDescription>
                Provide as much detail as possible to help us address the issue quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Roads">Roads & Infrastructure</SelectItem>
                        <SelectItem value="Lighting">Street Lighting</SelectItem>
                        <SelectItem value="Sanitation">Sanitation & Waste</SelectItem>
                        <SelectItem value="Water">Water & Sewage</SelectItem>
                        <SelectItem value="Traffic">Traffic & Safety</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Enter the address or location"
                      value={formData.location_address}
                      onChange={(e) => handleInputChange('location_address', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      className="shrink-0"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Coordinates Display */}
                  {(formData.location_lat || formData.location_lng) && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">Coordinates:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Latitude:</span>
                          <span className="ml-2 font-mono">{formData.location_lat || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Longitude:</span>
                          <span className="ml-2 font-mono">{formData.location_lng || 'Not set'}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, location_lat: '', location_lng: '' }))
                          }}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Clear coordinates
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Manual Coordinate Input */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="lat" className="text-xs">Latitude (optional)</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        placeholder="e.g., 40.7128"
                        value={formData.location_lat}
                        onChange={(e) => handleInputChange('location_lat', e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lng" className="text-xs">Longitude (optional)</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        placeholder="e.g., -74.0060"
                        value={formData.location_lng}
                        onChange={(e) => handleInputChange('location_lng', e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Camera className="h-4 w-4" />
                      {isUploading ? "Uploading..." : "Upload Photo"}
                    </label>
                    {formData.image_url && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Upload className="h-4 w-4" />
                        Image uploaded
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.description || !formData.category || !formData.location_address}
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Issue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Text */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Tips for better issue reports:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Be specific about the location and nature of the issue</li>
                    <li>Include photos when possible to help with identification</li>
                    <li>Provide accurate contact information for follow-up</li>
                    <li>Check if similar issues have already been reported</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}