"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Search,
  Eye,
  Edit,
  MapPin,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock issues data
const allIssues = [
  {
    id: "ISS-1248",
    title: "Large pothole on Main Street",
    category: "pothole",
    status: "submitted",
    priority: "high",
    location: "Main Street & 5th Ave",
    reportedDate: "2024-01-20T14:30:00Z",
    reporter: "John Doe",
    reporterEmail: "john.doe@email.com",
    assignedTo: null,
    department: null,
    estimatedCompletion: null,
    description: "Deep pothole causing damage to vehicles. Multiple citizens have reported this issue.",
    image: "/street-pothole.png",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "ISS-1249",
    title: "Broken streetlight near school",
    category: "streetlight",
    status: "in-review",
    priority: "medium",
    location: "School Street",
    reportedDate: "2024-01-20T12:15:00Z",
    reporter: "Jane Smith",
    reporterEmail: "jane.smith@email.com",
    assignedTo: "Mike Johnson",
    department: "Electrical Services",
    estimatedCompletion: "2024-01-25",
    description: "Streetlight has been out for a week, creating safety concerns for students.",
    image: "/broken-streetlight.jpg",
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: "ISS-1250",
    title: "Overflowing garbage bin",
    category: "garbage",
    status: "in-progress",
    priority: "medium",
    location: "Central Park",
    reportedDate: "2024-01-20T09:45:00Z",
    reporter: "Mike Johnson",
    reporterEmail: "mike.johnson@email.com",
    assignedTo: "Sarah Wilson",
    department: "Sanitation",
    estimatedCompletion: "2024-01-22",
    description: "Garbage bin needs immediate attention and regular maintenance schedule.",
    image: "/overflowing-garbage-bin.png",
    coordinates: { lat: 40.7829, lng: -73.9654 },
  },
  {
    id: "ISS-1247",
    title: "Water leak on sidewalk",
    category: "water-leakage",
    status: "resolved",
    priority: "high",
    location: "Oak Street",
    reportedDate: "2024-01-18T16:20:00Z",
    reporter: "Sarah Wilson",
    reporterEmail: "sarah.wilson@email.com",
    assignedTo: "David Kim",
    department: "Water & Sewage",
    estimatedCompletion: "2024-01-20",
    description: "Continuous water leak creating puddles and potential safety hazard.",
    image: "/water-leak-on-sidewalk.jpg",
    coordinates: { lat: 40.7505, lng: -73.9934 },
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

export default function AdminIssuesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])

  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const statusCounts = {
    all: allIssues.length,
    submitted: allIssues.filter((i) => i.status === "submitted").length,
    "in-review": allIssues.filter((i) => i.status === "in-review").length,
    "in-progress": allIssues.filter((i) => i.status === "in-progress").length,
    resolved: allIssues.filter((i) => i.status === "resolved").length,
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on issues:`, selectedIssues)
    setSelectedIssues([])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Issue Management</h1>
                <p className="text-muted-foreground">Track, assign, and manage all civic issues</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedIssues.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions ({selectedIssues.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("assign")}>Assign to Department</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("priority")}>Change Priority</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("status")}>Update Status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button size="sm" asChild>
                <Link href="/admin/issues/map">
                  <MapPin className="w-4 h-4 mr-2" />
                  Map View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues, locations, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
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
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
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
            </div>
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="submitted">Submitted ({statusCounts.submitted})</TabsTrigger>
            <TabsTrigger value="in-review">In Review ({statusCounts["in-review"]})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({statusCounts["in-progress"]})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({statusCounts.resolved})</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Issues ({filteredIssues.length})</CardTitle>
                <CardDescription>
                  {statusFilter === "all" ? "All issues" : `Issues with status: ${statusFilter.replace("-", " ")}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedIssues.length === filteredIssues.length && filteredIssues.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIssues(filteredIssues.map((issue) => issue.id))
                              } else {
                                setSelectedIssues([])
                              }
                            }}
                            className="rounded"
                          />
                        </TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Reported</TableHead>
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedIssues.includes(issue.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIssues([...selectedIssues, issue.id])
                                } else {
                                  setSelectedIssues(selectedIssues.filter((id) => id !== issue.id))
                                }
                              }}
                              className="rounded"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{issue.title}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {issue.location}
                              </div>
                              <div className="text-xs text-muted-foreground">{issue.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(issue.status)}>
                              {getStatusIcon(issue.status)}
                              <span className="ml-1 capitalize">{issue.status.replace("-", " ")}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(issue.priority)} variant="outline">
                              {issue.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getCategoryLabel(issue.category)}</Badge>
                          </TableCell>
                          <TableCell>
                            {issue.assignedTo ? (
                              <div className="space-y-1">
                                <div className="text-sm font-medium">{issue.assignedTo}</div>
                                <div className="text-xs text-muted-foreground">{issue.department}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(issue.reportedDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {issue.reporter}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/issues/${issue.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/issues/${issue.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Issue
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Assign to Department</DropdownMenuItem>
                                <DropdownMenuItem>Change Priority</DropdownMenuItem>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredIssues.length === 0 && (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
                    <p className="text-muted-foreground">
                      No issues match your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
