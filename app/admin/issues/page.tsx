"use client";

import React, { useEffect, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
} from "lucide-react";

type Issue = {
    id: string;
    title: string;
    description?: string;
    category: string;
    status: string;
    priority: string | null;
    location_address: string | null;
    created_at: string;
    updated_at?: string;
    user_id?: string;
    assigned_to?: string;
    estimated_completion?: string;
    image_url?: string;
    coordinates?: { lat: number; lng: number };
    profiles?: {
        full_name: string;
        email: string;
    };
    assigned_profile?: {
        full_name: string;
        email: string;
    };
    votes_count?: number;
    comments_count?: number;
};

const supabase = createClient();

const getStatusColor = (status: string) => {
    switch (status) {
        case "submitted":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        case "in-review":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        case "in-progress":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
        case "resolved":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "high":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        case "medium":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        case "low":
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "submitted":
            return <Clock className="w-4 h-4" />;
        case "in-review":
            return <Eye className="w-4 h-4" />;
        case "in-progress":
            return <AlertTriangle className="w-4 h-4" />;
        case "resolved":
            return <CheckCircle className="w-4 h-4" />;
        default:
            return <Clock className="w-4 h-4" />;
    }
};

const getCategoryLabel = (category: string) => {
    switch (category) {
        case "pothole":
            return "Pothole";
        case "streetlight":
            return "Streetlight";
        case "garbage":
            return "Garbage";
        case "water-leakage":
            return "Water Leakage";
        default:
            return category.charAt(0).toUpperCase() + category.slice(1);
    }
};

export default function AdminIssuesPage() {
    const [allIssues, setAllIssues] = useState<Issue[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // menu state - only need one state variable
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Single useEffect for handling outside clicks
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            // Close menu if click is outside any action-menu
            if (!target.closest(".action-menu")) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("issues")
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        email
                    ),
                    assigned_profile:assigned_to (
                        full_name,
                        email
                    )
                `)
                .order("created_at", { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            setAllIssues((data as Issue[]) || []);
        } catch (err: any) {
            console.error("Error fetching issues:", err);
            setError(err.message || "Failed to load issues");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const toggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent event bubbling
        setOpenMenuId((prev) => (prev === id ? null : id));
    };
  const [allIssues, setAllIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingIssue, setProcessingIssue] = useState<string | null>(null)

  // Fetch issues from API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/issues?limit=100') // Get more issues for admin
        if (response.ok) {
          const data = await response.json()
          setAllIssues(data.issues || [])
        } else {
          setError('Failed to fetch issues')
        }
      } catch (error) {
        console.error('Error fetching issues:', error)
        setError('Error loading issues')
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

    const filteredIssues = allIssues.filter((issue) => {
        const matchesSearch =
            (issue.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (issue.location_address_address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (issue.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || (issue.priority || "medium") === priorityFilter;
        const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    const statusCounts = {
        all: allIssues.length,
        submitted: allIssues.filter((i) => i.status === "submitted").length,
        assigned: allIssues.filter((i) => i.status === "assigned").length,
        in_progress: allIssues.filter((i) => i.status === "in_progress").length,
        resolved: allIssues.filter((i) => i.status === "resolved").length,
    closed: allIssues.filter((i) => i.status === "closed").length,
    };

    const handleBulkAction = (action: string) => {
        console.log(`Performing ${action} on issues:`, selectedIssues);
        // TODO: Implement bulk actions on backend
        setSelectedIssues([]);
    };

    // Action helpers (simple prompts for prototype)
    const assignToDepartment = async (issueId: string) => {
        const dept: string | null = prompt("Enter department to assign (e.g., road, sanitation):");
        if (!dept) return;
        try {
            setLoading(true);
            const { error: upErr } = await supabase
                .from("issues")
                .update({ assigned_to: dept } )
                .eq("id", issueId);
            if (upErr) throw upErr;
            await fetchIssues();
            setOpenMenuId(null);
        } catch (err: any) {
            console.error("Assign error:", err);
            alert("Failed to assign department: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    const changePriority = async (issueId: string) => {
        const p = prompt("Enter priority (high / medium / low):", "medium");
        if (!p) return;
        const priority = p.toLowerCase();
        if (!["high", "medium", "low"].includes(priority)) {
            alert("Invalid priority. Use: high, medium or low.");
            return;
        }
        try {
            setLoading(true);
            const { error: upErr } = await supabase
                .from("issues")
                .update({ priority })
                .eq("id", issueId);
            if (upErr) throw upErr;
            await fetchIssues();
            setOpenMenuId(null);
        } catch (err: any) {
            console.error("Priority update error:", err);
            alert("Failed to update priority: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (issueId: string) => {
        const s = prompt("Enter status (submitted / in-review / in-progress / resolved):", "in-progress");
        if (!s) return;
        const status = s.toLowerCase();
        if (!["submitted", "in-review", "in-progress", "resolved"].includes(status)) {
            alert("Invalid status. Use: submitted, in-review, in-progress or resolved.");
            return;
        }
        try {
            setLoading(true);
            const { error: upErr } = await supabase
                .from("issues")
                .update({ status })
                .eq("id", issueId);
            if (upErr) throw upErr;
            await fetchIssues();
            setOpenMenuId(null);
        } catch (err: any) {
            console.error("Status update error:", err);
            alert("Failed to update status: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="p-8">
                            <div className="text-center">Loading issues...</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

  const handleStatusUpdate = async (issueId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: notes || `Status changed to ${newStatus} by admin`
        }),
      });

      if (response.ok) {
        // Update the local state instead of full page reload
        setAllIssues(prevIssues => 
          prevIssues.map(issue => 
            issue.id === issueId 
              ? { ...issue, status: newStatus, updated_at: new Date().toISOString() }
              : issue
          )
        );
        
        // Show success message
        const statusMessages = {
          'assigned': 'Issue accepted and assigned to department',
          'in_progress': 'Work started on issue',
          'resolved': 'Issue marked as resolved',
          'closed': 'Issue closed'
        };
        
        const message = statusMessages[newStatus as keyof typeof statusMessages] || `Status updated to ${newStatus}`;
        
        // Import and use toast utility
        import('@/lib/toast-utils').then(({ showSuccessToast }) => {
          showSuccessToast(message);
        });
        
      } else {
        const errorData = await response.json();
        
        // Show error message
        import('@/lib/toast-utils').then(({ showErrorToast }) => {
          showErrorToast(errorData.error || 'Failed to update status');
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      
      // Show error message
      import('@/lib/toast-utils').then(({ showErrorToast }) => {
        showErrorToast('Failed to update issue status');
      });
    }
  };

  const handleIssueAction = async (action: string, issueId: string, currentStatus: string) => {
    // Prevent multiple rapid clicks
    if (processingIssue) return;
    
    try {
      setProcessingIssue(issueId);
      
      switch (action) {
        case 'accept':
          await handleStatusUpdate(issueId, 'assigned', 'Issue accepted and assigned to department');
          break;
        case 'reject':
          await handleStatusUpdate(issueId, 'closed', 'Issue rejected by admin');
          break;
        case 'in_progress':
          await handleStatusUpdate(issueId, 'in_progress', 'Work started on this issue');
          break;
        case 'resolve':
          await handleStatusUpdate(issueId, 'resolved', 'Issue has been resolved');
          break;
        case 'close':
          await handleStatusUpdate(issueId, 'closed', 'Issue closed by admin');
          break;
        case 'view':
          setProcessingIssue(null); // Clear processing state before navigation
          window.location.href = `/admin/issues/${issueId}`;
          return; // Don't set processing to null again
        case 'edit':
          setProcessingIssue(null); // Clear processing state before navigation
          window.location.href = `/admin/issues/${issueId}`;
          return; // Don't set processing to null again
        default:
          console.log('Unknown action:', action);
      }
      
      // Add a small delay to show the success message before clearing processing state
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error performing action:', error);
      import('@/lib/toast-utils').then(({ showErrorToast }) => {
        showErrorToast('Failed to perform action');
      });
    } finally {
      setProcessingIssue(null);
    }
  };

  const refreshIssues = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Issue Management</h1>
                <p className="text-muted-foreground">Track, assign, and manage all civic issues</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedIssues.length > 0 && (
                <button 
                  onClick={() => handleBulkAction("status")}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Bulk Actions ({selectedIssues.length})
                </button>
              )}
              <Link href="/admin/issues/map">
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  Map View
                </button>
              </Link>
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
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
                    <SelectItem value="roads">Roads</SelectItem>
                                        <SelectItem value="potholes">Potholes</SelectItem>
                                        <SelectItem value="streetlights">Streetlights</SelectItem>
                                        <SelectItem value="garbage">Garbage</SelectItem>
                                        <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="drainage">Drainage</SelectItem>
                    <SelectItem value="parks">Parks</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading issues...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Issues</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

                {/* Status Tabs */}
        {!loading && !error && (
                  <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
                      <TabsList className="grid w-full grid-cols-6">
                          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                          <TabsTrigger value="submitted">Submitted ({statusCounts.submitted})</TabsTrigger>
                          <TabsTrigger value="assigned">Assigned ({statusCounts.assigned})</TabsTrigger>
                          <TabsTrigger value="in_progress">In Progress ({statusCounts.in_progress})</TabsTrigger>
                          <TabsTrigger value="resolved">Resolved ({statusCounts.resolved})</TabsTrigger>
              <TabsTrigger value="closed">Closed ({statusCounts.closed})</TabsTrigger>
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
                                {issue.location_address}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {issue.id.slice(0, 8)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(issue.status)}>
                              {getStatusIcon(issue.status)}
                              <span className="ml-1 capitalize">{issue.status.replace("_", " ")}</span>
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
                            {issue.assigned_profile ? (
                              <div className="space-y-1">
                                <div className="text-sm font-medium">{issue.assigned_profile.full_name}</div>
                                <div className="text-xs text-muted-foreground">{issue.department?.name}</div>
                              </div>
                            ) : issue.department ? (
                              <div className="space-y-1">
                                <div className="text-sm font-medium">Department</div>
                                <div className="text-xs text-muted-foreground">{issue.department.name}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(issue.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {issue.profiles?.full_name || 'Unknown'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <SimpleAdminActions
                              issue={{
                                id: issue.id,
                                status: issue.status,
                                title: issue.title
                              }}
                              onAction={handleIssueAction}
                              processing={processingIssue === issue.id}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                                {filteredIssues.length === 0 && !error && (
                                    <div className="text-center py-8">
                                        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
                                        <p className="text-muted-foreground">
                                            No issues match your current filters. Try adjusting your search
                                            criteria.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
        )}
            </div>
        </div>
    );
}