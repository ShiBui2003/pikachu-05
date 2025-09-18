"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  MessageCircle,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Send,
  Heart,
  Flag,
} from "lucide-react"

// Mock data - in real app this would come from API
const mockIssue = {
  id: "ISS-001",
  title: "Large pothole on Main Street",
  category: "pothole",
  status: "in-progress",
  priority: "high",
  location: "Main Street & 5th Ave",
  coordinates: { lat: 40.7128, lng: -74.006 },
  reportedDate: "2024-01-15",
  image: "/street-pothole.png",
  description:
    "There's a large pothole on Main Street that's been causing damage to vehicles. It's approximately 3 feet wide and 8 inches deep. Multiple cars have reported tire damage from hitting this pothole. The issue has been getting worse with recent rain, and it's becoming a safety hazard for both cars and pedestrians who have to walk around it.",
  reporter: {
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-06-15",
  },
  assignedTo: "Public Works Department",
  estimatedCompletion: "2024-01-25",
  upvotes: 47,
  hasUpvoted: false,
  followers: 23,
  isFollowing: false,
  timeline: [
    {
      status: "submitted",
      date: "2024-01-15T10:30:00Z",
      description: "Issue reported by citizen",
      user: "John Doe",
      userType: "citizen",
    },
    {
      status: "in-review",
      date: "2024-01-16T09:15:00Z",
      description: "Issue reviewed and assigned to Public Works Department",
      user: "Admin Sarah",
      userType: "admin",
    },
    {
      status: "in-progress",
      date: "2024-01-17T14:20:00Z",
      description: "Work crew dispatched to assess the damage",
      user: "Public Works Team",
      userType: "admin",
    },
  ],
  comments: [
    {
      id: "1",
      user: "Jane Smith",
      userType: "citizen",
      avatar: "/placeholder.svg?height=32&width=32",
      message: "I hit this pothole yesterday and it damaged my tire. This needs urgent attention!",
      timestamp: "2024-01-16T08:30:00Z",
      upvotes: 12,
    },
    {
      id: "2",
      user: "Mike Johnson",
      userType: "citizen",
      avatar: "/placeholder.svg?height=32&width=32",
      message: "Same here! My car's alignment is now off because of this pothole.",
      timestamp: "2024-01-16T15:45:00Z",
      upvotes: 8,
    },
    {
      id: "3",
      user: "Public Works Team",
      userType: "admin",
      avatar: "/placeholder.svg?height=32&width=32",
      message:
        "We've scheduled this for repair next week. Materials have been ordered and crew will be dispatched on Monday.",
      timestamp: "2024-01-17T16:00:00Z",
      upvotes: 15,
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
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
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
  const params = useParams()
  const [hasUpvoted, setHasUpvoted] = useState(mockIssue.hasUpvoted)
  const [upvotes, setUpvotes] = useState(mockIssue.upvotes)
  const [isFollowing, setIsFollowing] = useState(mockIssue.isFollowing)
  const [followers, setFollowers] = useState(mockIssue.followers)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(mockIssue.comments)

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes((prev) => prev - 1)
      setHasUpvoted(false)
    } else {
      setUpvotes((prev) => prev + 1)
      setHasUpvoted(true)
    }
  }

  const handleFollow = () => {
    if (isFollowing) {
      setFollowers((prev) => prev - 1)
      setIsFollowing(false)
    } else {
      setFollowers((prev) => prev + 1)
      setIsFollowing(true)
    }
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: "Current User",
        userType: "citizen" as const,
        avatar: "/placeholder.svg?height=32&width=32",
        message: newComment,
        timestamp: new Date().toISOString(),
        upvotes: 0,
      }
      setComments((prev) => [...prev, comment])
      setNewComment("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first header */}
      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/citizen/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Issue Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-balance">{mockIssue.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getStatusColor(mockIssue.status)}>
                  {getStatusIcon(mockIssue.status)}
                  <span className="ml-1 capitalize">{mockIssue.status.replace("-", " ")}</span>
                </Badge>
                <Badge variant="outline" className={getPriorityColor(mockIssue.priority)}>
                  {mockIssue.priority.toUpperCase()} PRIORITY
                </Badge>
                <Badge variant="outline">{mockIssue.category.toUpperCase()}</Badge>
              </div>
            </div>
          </div>

          {/* Action buttons - mobile optimized */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button variant={hasUpvoted ? "default" : "outline"} onClick={handleUpvote} className="flex-1 sm:flex-none">
              <ThumbsUp className={`w-4 h-4 mr-2 ${hasUpvoted ? "fill-current" : ""}`} />
              {hasUpvoted ? "Upvoted" : "Upvote"} ({upvotes})
            </Button>
            <Button
              variant={isFollowing ? "default" : "outline"}
              onClick={handleFollow}
              className="flex-1 sm:flex-none"
            >
              <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
              {isFollowing ? "Following" : "Follow"} ({followers})
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={mockIssue.image || "/placeholder.svg"}
                    alt={mockIssue.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Issue Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{mockIssue.description}</p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIssue.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}
                        >
                          {getStatusIcon(event.status)}
                        </div>
                        {index < mockIssue.timeline.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h4 className="font-medium capitalize">{event.status.replace("-", " ")}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {event.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <Badge variant={comment.userType === "admin" ? "default" : "secondary"} className="text-xs">
                              {comment.userType}
                            </Badge>
                          </div>
                          <p className="text-sm">{comment.message}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{new Date(comment.timestamp).toLocaleString()}</span>
                          <Button variant="ghost" size="sm" className="h-auto p-1">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.upvotes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Issue Details */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{mockIssue.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Reported {new Date(mockIssue.reportedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Assigned to {mockIssue.assignedTo}</span>
                </div>
                {mockIssue.estimatedCompletion && (
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Est. completion {new Date(mockIssue.estimatedCompletion).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reporter Info */}
            <Card>
              <CardHeader>
                <CardTitle>Reported By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={mockIssue.reporter.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{mockIssue.reporter.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{mockIssue.reporter.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(mockIssue.reporter.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-b-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Interactive map</p>
                    <p className="text-xs text-muted-foreground">
                      {mockIssue.coordinates.lat}, {mockIssue.coordinates.lng}
                    </p>
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
