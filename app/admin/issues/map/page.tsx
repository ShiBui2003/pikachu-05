"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Map, List, MapPin, Eye } from "lucide-react"

// Mock issues with coordinates
const mapIssues = [
  {
    id: "ISS-1248",
    title: "Large pothole on Main Street",
    status: "submitted",
    priority: "high",
    location: "Main Street & 5th Ave",
    coordinates: { lat: 40.7128, lng: -74.006 },
    category: "pothole",
  },
  {
    id: "ISS-1249",
    title: "Broken streetlight near school",
    status: "in-review",
    priority: "medium",
    location: "School Street",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    category: "streetlight",
  },
  {
    id: "ISS-1250",
    title: "Overflowing garbage bin",
    status: "in-progress",
    priority: "medium",
    location: "Central Park",
    coordinates: { lat: 40.7829, lng: -73.9654 },
    category: "garbage",
  },
  {
    id: "ISS-1247",
    title: "Water leak on sidewalk",
    status: "resolved",
    priority: "high",
    location: "Oak Street",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    category: "water-leakage",
  },
]

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

export default function IssuesMapPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)

  const filteredIssues = mapIssues.filter((issue) => {
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    return matchesStatus && matchesPriority
  })

  const selectedIssueData = mapIssues.find((issue) => issue.id === selectedIssue)

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
                <h1 className="text-2xl font-bold">Issues Map View</h1>
                <p className="text-muted-foreground">Geographic visualization of all civic issues</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/issues">
                  <List className="w-4 h-4 mr-2" />
                  List View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Map className="w-5 h-5 mr-2 text-accent" />
                    Interactive Map
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription>
                  Click on markers to view issue details. Showing {filteredIssues.length} issues.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Map Placeholder */}
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                    <p className="text-muted-foreground">Integration with Google Maps or Mapbox would display here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Issues would appear as colored markers based on status and priority
                    </p>
                  </div>

                  {/* Mock Issue Markers */}
                  <div className="absolute inset-0">
                    {filteredIssues.map((issue, index) => (
                      <div
                        key={issue.id}
                        className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${
                          issue.status === "submitted"
                            ? "bg-status-submitted"
                            : issue.status === "in-review"
                              ? "bg-status-review"
                              : issue.status === "in-progress"
                                ? "bg-status-progress"
                                : "bg-status-resolved"
                        } ${selectedIssue === issue.id ? "ring-2 ring-accent ring-offset-2" : ""}`}
                        style={{
                          left: `${20 + index * 15}%`,
                          top: `${30 + (index % 3) * 20}%`,
                        }}
                        onClick={() => setSelectedIssue(issue.id)}
                        title={issue.title}
                      />
                    ))}
                  </div>
                </div>

                {/* Map Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-status-submitted mr-2" />
                    <span>Submitted</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-status-review mr-2" />
                    <span>In Review</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-status-progress mr-2" />
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-status-resolved mr-2" />
                    <span>Resolved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Issue Details */}
            {selectedIssueData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Issue Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{selectedIssueData.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedIssueData.id}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedIssueData.status)}>
                      {selectedIssueData.status.replace("-", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(selectedIssueData.priority)} variant="outline">
                      {selectedIssueData.priority}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{selectedIssueData.location}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Coordinates: {selectedIssueData.coordinates.lat}, {selectedIssueData.coordinates.lng}
                    </div>
                  </div>

                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/admin/issues/${selectedIssueData.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select an Issue</h3>
                  <p className="text-muted-foreground">Click on a marker to view issue details.</p>
                </CardContent>
              </Card>
            )}

            {/* Issues List */}
            <Card>
              <CardHeader>
                <CardTitle>Issues on Map ({filteredIssues.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedIssue === issue.id ? "ring-2 ring-accent" : ""
                    }`}
                    onClick={() => setSelectedIssue(issue.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{issue.title}</h4>
                        <Badge className={getStatusColor(issue.status)} variant="secondary">
                          {issue.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{issue.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{issue.id}</span>
                        <Badge className={getPriorityColor(issue.priority)} variant="outline">
                          {issue.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
