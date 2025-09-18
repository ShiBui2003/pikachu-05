"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, Search, Map, List, Calendar, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react"
import InteractiveMap from "@/components/interactive-map"

// Mock data for issues
const mockIssues = [
  {
    id: "ISS-001",
    title: "Large pothole on Main Street",
    category: "pothole",
    status: "in-progress",
    location: "Main Street & 5th Ave",
    reportedDate: "2024-01-15",
    image: "/street-pothole.png",
    description: "Deep pothole causing damage to vehicles",
    reporter: "John Doe",
  },
  {
    id: "ISS-002",
    title: "Broken streetlight",
    category: "streetlight",
    status: "submitted",
    location: "Park Avenue",
    reportedDate: "2024-01-14",
    image: "/broken-streetlight.jpg",
    description: "Streetlight has been out for 3 days",
    reporter: "Jane Smith",
  },
  {
    id: "ISS-003",
    title: "Overflowing garbage bin",
    category: "garbage",
    status: "resolved",
    location: "Central Park Entrance",
    reportedDate: "2024-01-10",
    image: "/overflowing-garbage-bin.png",
    description: "Garbage bin needs immediate attention",
    reporter: "Mike Johnson",
  },
  {
    id: "ISS-004",
    title: "Water leak on sidewalk",
    category: "water-leakage",
    status: "in-review",
    location: "Oak Street",
    reportedDate: "2024-01-12",
    image: "/water-leak-on-sidewalk.jpg",
    description: "Continuous water leak creating puddles",
    reporter: "Sarah Wilson",
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

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "pothole":
      return "Pothole"
    case "streetlight":
      return "Streetlight"
    case "garbage":
      return "Garbage"
    case "water-leakage":
      return "Water Leakage"
    default:
      return "Other"
  }
}

export default function CitizenDashboard() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MapPin className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold">Civic Issues Dashboard</h1>
                <p className="text-muted-foreground">Track and report community issues</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/citizen/report">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Issue
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/citizen/my-issues">My Issues</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold status-progress">156</p>
                </div>
                <Clock className="w-8 h-8 text-status-progress" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold status-resolved">892</p>
                </div>
                <CheckCircle className="w-8 h-8 text-status-resolved" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search issues or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
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

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="pothole">Pothole</SelectItem>
                    <SelectItem value="streetlight">Streetlight</SelectItem>
                    <SelectItem value="garbage">Garbage</SelectItem>
                    <SelectItem value="water-leakage">Water Leakage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {viewMode === "list" ? (
          <div className="grid gap-4">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={issue.image || "/placeholder.svg"}
                        alt={issue.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                        </div>
                        <Badge className={getStatusColor(issue.status)}>
                          {getStatusIcon(issue.status)}
                          <span className="ml-1 capitalize">{issue.status.replace("-", " ")}</span>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {issue.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(issue.reportedDate).toLocaleDateString()}
                        </div>
                        <Badge variant="outline">{getCategoryLabel(issue.category)}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <InteractiveMap />
        )}
      </div>
    </div>
  )
}
