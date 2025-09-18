"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  MessageSquare,
  Phone,
  Mail,
  Save,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock issue data - in real app this would come from params
const issueData = {
  id: "ISS-1248",
  title: "Large pothole on Main Street",
  category: "pothole",
  status: "submitted",
  priority: "high",
  location: "Main Street & 5th Ave",
  reportedDate: "2024-01-20T14:30:00Z",
  reporter: "John Doe",
  reporterEmail: "john.doe@email.com",
  reporterPhone: "+1 (555) 123-4567",
  assignedTo: null,
  department: null,
  estimatedCompletion: null,
  description: "Deep pothole causing damage to vehicles. Multiple citizens have reported this issue.",
  image: "/street-pothole.png",
  coordinates: { lat: 40.7128, lng: -74.006 },
  timeline: [
    {
      id: "1",
      action: "Issue Reported",
      description: "Citizen reported pothole issue with photo evidence",
      timestamp: "2024-01-20T14:30:00Z",
      user: "John Doe",
      userType: "citizen",
    },
  ],
  comments: [
    {
      id: "1",
      user: "John Doe",
      userType: "citizen",
      message: "This pothole has been getting worse over the past week. It's now causing damage to vehicles.",
      timestamp: "2024-01-20T14:35:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-status-submitted text-white"
    case "in-review":
      return "bg-status-review text-white"
    case "in-progress":
      return "bg-status-progress text-white"
    case "resolved":
      return "bg-status-resolved text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive text-destructive-foreground"
    case "medium":
      return "bg-status-review text-white"
    case "low":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "submitted":
      return <Clock className="w-4 h-4" />
    case "in-review":
      return <Eye className="w-4 h-4" />
    case "in-progress":
      return <AlertTriangle className="w-4 h-4" />
    case "resolved":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function IssueDetailPage() {
  const [issue, setIssue] = useState(issueData)
  const [isEditing, setIsEditing] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    toast({
      title: "Issue Updated",
      description: "The issue has been successfully updated.",
    })
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      user: "Admin User",
      userType: "admin" as const,
      message: newComment,
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setIssue((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }))

    setNewComment("")
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the issue.",
    })
  }

  const handleStatusChange = (newStatus: string) => {
    setIssue((prev) => ({ ...prev, status: newStatus }))

    const statusAction = {
      id: Date.now().toString(),
      action: `Status changed to ${newStatus.replace("-", " ")}`,
      description: `Issue status updated by admin`,
      timestamp: new Date().toISOString(),
      user: "Admin User",
      userType: "admin" as const,
    }

    setIssue((prev) => ({
      ...prev,
      timeline: [...prev.timeline, statusAction],
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/issues">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Issues
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{issue.title}</h1>
                <p className="text-muted-foreground">Issue ID: {issue.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              {isEditing && (
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Issue Details</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(issue.status)}>
                      {getStatusIcon(issue.status)}
                      <span className="ml-1 capitalize">{issue.status.replace("-", " ")}</span>
                    </Badge>
                    <Badge className={getPriorityColor(issue.priority)} variant="outline">
                      {issue.priority} priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={issue.image || "/placeholder.svg"}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={issue.title}
                          onChange={(e) => setIssue((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={issue.description}
                          onChange={(e) => setIssue((prev) => ({ ...prev, description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">{issue.description}</p>
                      </div>
                    </>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{issue.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{new Date(issue.reportedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline and Comments */}
            <Tabs defaultValue="timeline" className="space-y-4">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="comments">Comments ({issue.comments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Issue Timeline</CardTitle>
                    <CardDescription>Track the progress and history of this issue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {issue.timeline.map((event, index) => (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            {index < issue.timeline.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{event.action}</span>
                              <Badge variant="outline" className="text-xs">
                                {event.userType}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                            <div className="text-xs text-muted-foreground">
                              {event.user} • {new Date(event.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments & Communication</CardTitle>
                    <CardDescription>Internal notes and citizen communication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add Comment */}
                    <div className="space-y-2">
                      <Label htmlFor="comment">Add Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Add a comment or note about this issue..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {issue.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 border rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                            <AvatarFallback>
                              {comment.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.user}</span>
                              <Badge variant="outline" className="text-xs">
                                {comment.userType}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment & Status */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={issue.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={issue.priority}
                    onValueChange={(value) => setIssue((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={issue.department || ""}
                    onValueChange={(value) => setIssue((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="road-maintenance">Road Maintenance</SelectItem>
                      <SelectItem value="electrical">Electrical Services</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="water-sewage">Water & Sewage</SelectItem>
                      <SelectItem value="traffic">Traffic Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee">Assigned To</Label>
                  <Select
                    value={issue.assignedTo || ""}
                    onValueChange={(value) => setIssue((prev) => ({ ...prev, assignedTo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                      <SelectItem value="david-kim">David Kim</SelectItem>
                      <SelectItem value="lisa-thompson">Lisa Thompson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completion">Estimated Completion</Label>
                  <Input
                    id="completion"
                    type="date"
                    value={issue.estimatedCompletion || ""}
                    onChange={(e) => setIssue((prev) => ({ ...prev, estimatedCompletion: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reporter Information */}
            <Card>
              <CardHeader>
                <CardTitle>Reporter Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{issue.reporter}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${issue.reporterEmail}`} className="text-accent hover:underline">
                    {issue.reporterEmail}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <a href={`tel:${issue.reporterPhone}`} className="text-accent hover:underline">
                    {issue.reporterPhone}
                  </a>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Reporter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{issue.location}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Coordinates: {issue.coordinates.lat}, {issue.coordinates.lng}
                  </div>
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Interactive map would be displayed here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
