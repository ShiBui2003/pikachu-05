"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const issuesByMonth = [
  { month: "Jan", submitted: 45, resolved: 38 },
  { month: "Feb", submitted: 52, resolved: 41 },
  { month: "Mar", submitted: 48, resolved: 45 },
  { month: "Apr", submitted: 61, resolved: 52 },
  { month: "May", submitted: 55, resolved: 58 },
  { month: "Jun", submitted: 67, resolved: 61 },
]

const issuesByCategory = [
  { category: "Roads", count: 89, color: "#3b82f6" },
  { category: "Lighting", count: 67, color: "#f59e0b" },
  { category: "Sanitation", count: 54, color: "#10b981" },
  { category: "Parks", count: 43, color: "#8b5cf6" },
  { category: "Water", count: 32, color: "#ef4444" },
  { category: "Other", count: 28, color: "#6b7280" },
]

const responseTime = [
  { department: "Roads", avgHours: 24 },
  { department: "Lighting", avgHours: 18 },
  { department: "Sanitation", avgHours: 12 },
  { department: "Parks", avgHours: 36 },
  { department: "Water", avgHours: 8 },
]

const resolutionTrend = [
  { week: "Week 1", resolved: 12, target: 15 },
  { week: "Week 2", resolved: 18, target: 15 },
  { week: "Week 3", resolved: 14, target: 15 },
  { week: "Week 4", resolved: 22, target: 15 },
  { week: "Week 5", resolved: 19, target: 15 },
  { week: "Week 6", resolved: 25, target: 15 },
]

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Issues by Month */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Issues Submitted vs Resolved</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issuesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="submitted" fill="#3b82f6" name="Submitted" />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Issues by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Issues by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issuesByCategory}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ category, count }) => `${category}: ${count}`}
              >
                {issuesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Response Time by Department */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Average Response Time (Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseTime} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="department" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="avgHours" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resolution Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resolution Trend vs Target</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={resolutionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
