"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Upload, Camera, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    coordinates: { lat: "", lng: "" },
    image: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude.toString(),
              lng: position.coords.longitude.toString(),
            },
          }))
          toast({
            title: "Location Detected",
            description: "Your current location has been captured.",
          })
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to detect location. Please enter manually.",
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Issue Reported Successfully!",
      description:
        "Your issue has been submitted and assigned ID: ISS-" +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0"),
    })

    setIsSubmitting(false)

    // Reset form
    setFormData({
      title: "",
      category: "",
      description: "",
      location: "",
      coordinates: { lat: "", lng: "" },
      image: null,
    })

    // Redirect to dashboard after success
    setTimeout(() => {
      window.location.href = "/citizen/dashboard"
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/citizen/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Report New Issue</h1>
              <p className="text-muted-foreground">Help improve your community by reporting civic issues</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
              Issue Details
            </CardTitle>
            <CardDescription>
              Provide as much detail as possible to help municipal authorities address the issue quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pothole">Pothole</SelectItem>
                    <SelectItem value="streetlight">Streetlight</SelectItem>
                    <SelectItem value="garbage">Garbage Collection</SelectItem>
                    <SelectItem value="water-leakage">Water Leakage</SelectItem>
                    <SelectItem value="traffic-signal">Traffic Signal</SelectItem>
                    <SelectItem value="road-damage">Road Damage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the issue, including any relevant context or urgency"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Label>Location *</Label>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter street address or landmark"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button type="button" variant="outline" onClick={handleLocationDetect}>
                      <MapPin className="w-4 h-4 mr-2" />
                      Detect
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Latitude"
                      value={formData.coordinates.lat}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          coordinates: { ...prev.coordinates, lat: e.target.value },
                        }))
                      }
                    />
                    <Input
                      placeholder="Longitude"
                      value={formData.coordinates.lng}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          coordinates: { ...prev.coordinates, lng: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive map for location selection</p>
                    <p className="text-xs text-muted-foreground">Click to pin exact location</p>
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Photo Evidence</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <div className="text-center">
                    {formData.image ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-status-resolved mx-auto" />
                        <p className="text-sm font-medium">{formData.image.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-sm font-medium">Upload a photo of the issue</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <label htmlFor="photo" className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </label>
                          </Button>
                          <Button type="button" variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            Take Photo
                          </Button>
                        </div>
                      </div>
                    )}
                    <input id="photo" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Issue Report
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/citizen/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Reporting Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Be specific and descriptive in your issue title and description</p>
            <p>• Include photos whenever possible - they help authorities understand the problem</p>
            <p>• Provide accurate location information for faster response</p>
            <p>• Check if the issue has already been reported to avoid duplicates</p>
            <p>• For emergencies, contact emergency services directly</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
