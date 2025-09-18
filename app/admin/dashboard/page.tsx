"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Calendar,
  TrendingUp,
  Bell,
  FileText,
  BarChart3,
} from "lucide-react"
import AnalyticsCharts from "@/components/analytics-charts"

// Mock data for admin dashboard
const overviewStats = {
  totalIssues: 1247,
  pendingIssues: 156,
  inProgressIssues: 199,
  resolvedIssues: 892,
  newThisWeek: 23,
  resolvedThisWeek: 18,
  averageResolutionTime: 4.2, // days
  citizenSatisfaction: 87, // percentage
}

const categoryData = [
  { name: "Potholes", value: 342, color: "#8b5cf6" },
  { name: "Streetlights", value: 198, color: "#06b6d4" },
  { name: "Garbage", value: 156, color: "#10b981" },
  { name: "Water Leaks", value: 134, color: "#f59e0b" },
  { name: "Traffic Signals", value: 89, color: "#ef4444" },
  { name: "Other", value: 328, color: "#6b7280" },
]

const monthlyTrends = [
  { month: "Jul", reported: 89, resolved: 76 },
  { month: "Aug", reported: 112, resolved: 98 },
  { month: "Sep", reported: 95, resolved: 102 },
  { month: "Oct", reported: 134, resolved: 118 },
  { month: "Nov", reported: 156, resolved: 142 },
  { month: "Dec", reported: 178, resolved: 165 },
  { month: "Jan", reported: 145, resolved: 134 },
]

const departmentPerformance = [
  { department: "Road Maintenance", assigned: 45, completed: 38, efficiency: 84 },
  { department: "Electrical Services", assigned: 32, completed: 29, efficiency: 91 },
  { department: "Sanitation", assigned: 28, completed: 26, efficiency: 93 },
  { department: "Water & Sewage", assigned: 21, completed: 18, efficiency: 86 },
  { department: "Traffic Management", assigned: 15, completed: 12, efficiency: 80 },
]

const recentIssues = [
  {
    id: "ISS-1248",
    title: "Large pothole on Main Street",
    category: "pothole",
    status: "submitted",
    location: "Main Street & 5th Ave",
    reportedDate: "2024-01-20T14:30:00Z",
    priority: "high",
    reporter: "John Doe",
  },
  {
    id: "ISS-1249",
    title: "Broken streetlight near school",
    category: "streetlight",
    status: "in-review",
    location: "School Street",
    reportedDate: "2024-01-20T12:15:00Z",
    priority: "medium",
    reporter: "Jane Smith",
  },
  {
    id: "ISS-1250",
    title: "Overflowing garbage bin",
    category: "garbage",
    status: "in-progress",
    location: "Central Park",
    reportedDate: "2024-01-20T09:45:00Z",
    priority: "medium",
    reporter: "Mike Johnson",
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

export default function AdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold">Municipal Dashboard</h1>
                <p className="text-muted-foreground">Civic issue management and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                    5
                  </Badge>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/reports">
                  <FileText className="w-4 h-4 mr-2" />
                  Reports
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/admin/issues">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Manage Issues
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">{overviewStats.totalIssues.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-status-resolved">+{overviewStats.newThisWeek}</span> this week
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold status-submitted">{overviewStats.pendingIssues}</p>
                  <p className="text-xs text-muted-foreground">Awaiting assignment</p>
                </div>
                <Clock className="w-8 h-8 text-status-submitted" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold status-progress">{overviewStats.inProgressIssues}</p>
                  <p className="text-xs text-muted-foreground">Being worked on</p>
                </div>
                <Eye className="w-8 h-8 text-status-progress" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold status-resolved">{overviewStats.resolvedIssues}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-status-resolved">+{overviewStats.resolvedThisWeek}</span> this week
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-status-resolved" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Resolution Time</span>
                <span className="font-semibold">{overviewStats.averageResolutionTime} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Citizen Satisfaction</span>
                <span className="font-semibold">{overviewStats.citizenSatisfaction}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Resolution Rate</span>
                  <span>71.5%</span>
                </div>
                <Progress value={71.5} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Response Time</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.department}</span>
                    <span>{dept.efficiency}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {dept.completed}/{dept.assigned} completed
                    </span>
                    <Progress value={dept.efficiency} className="h-1 flex-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Issues reported vs resolved over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="reported" stroke="#8b5cf6" strokeWidth={2} name="Reported" />
                    <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>Latest reports requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{issue.title}</h4>
                      <Badge className={getStatusColor(issue.status)} variant="secondary">
                        {issue.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {issue.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(issue.reportedDate).toLocaleDateString()}
                      </span>
                      <Badge className={getPriorityColor(issue.priority)} variant="outline">
                        {issue.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/issues/${issue.id}`}>View</Link>
                  </Button>
                </div>
              ))}
              <div className="text-center pt-2">
                <Button variant="outline" asChild>
                  <Link href="/admin/issues">View All Issues</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Analytics Charts Section */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Comprehensive data visualization and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsCharts />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
