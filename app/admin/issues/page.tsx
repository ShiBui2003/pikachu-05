"use client";

import React, { useEffect, useRef, useState } from "react";
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

    const filteredIssues = allIssues.filter((issue) => {
        const matchesSearch =
            (issue.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (issue.location_address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (issue.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || (issue.priority || "medium") === priorityFilter;
        const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    const statusCounts = {
        all: allIssues.length,
        submitted: allIssues.filter((i) => i.status === "submitted").length,
        "in-review": allIssues.filter((i) => i.status === "in-review").length,
        "in-progress": allIssues.filter((i) => i.status === "in-progress").length,
        resolved: allIssues.filter((i) => i.status === "resolved").length,
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
                                <p className="text-muted-foreground">
                                    Track, assign, and manage all civic issues
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {selectedIssues.length > 0 && (
                                <div>
                                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("assign")}>
                                        Bulk Actions ({selectedIssues.length})
                                    </Button>
                                </div>
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
                        {error && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-red-600 text-center">{error}</div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Issues ({filteredIssues.length})</CardTitle>
                                <CardDescription>
                                    {statusFilter === "all"
                                        ? "All issues"
                                        : `Issues with status: ${statusFilter.replace("-", " ")}`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedIssues.length === filteredIssues.length &&
                                                            filteredIssues.length > 0
                                                        }
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedIssues(filteredIssues.map((issue) => issue.id));
                                                            } else {
                                                                setSelectedIssues([]);
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
                                                                    setSelectedIssues([...selectedIssues, issue.id]);
                                                                } else {
                                                                    setSelectedIssues(selectedIssues.filter((id) => id !== issue.id));
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
                                                                {issue.location_address || "N/A"}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">{issue.id}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getStatusColor(issue.status)}>
                                                            {getStatusIcon(issue.status)}
                                                            <span className="ml-1 capitalize">
                                                                {issue.status.replace(/[_-]/g, " ")}
                                                            </span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getPriorityColor(issue.priority || "medium")} variant="outline">
                                                            {(issue.priority || "medium").toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{getCategoryLabel(issue.category)}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {issue.assigned_profile ? (
                                                            <div className="space-y-1">
                                                                <div className="text-sm font-medium">{issue.assigned_profile.full_name}</div>
                                                                <div className="text-xs text-muted-foreground">{issue.assigned_profile.email}</div>
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
                                                                {issue.profiles?.full_name || "Anonymous"}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {/* Fixed action menu */}
                                                        <div className="relative action-menu inline-block text-left">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                onClick={(e) => toggleMenu(e, issue.id)}
                                                            >
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>

                                                            {openMenuId === issue.id && (
                                                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border rounded-md shadow-lg z-50 overflow-hidden">
                                                                    <div className="py-1">
                                                                        <Link
                                                                            href={`/admin/issues/${issue.id}`}
                                                                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                                                                            onClick={() => setOpenMenuId(null)}
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                            View Details
                                                                        </Link>

                                                                        

                                                                        <div className="border-t my-1" />

                                                                        <button
                                                                            onClick={() => assignToDepartment(issue.id)}
                                                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                                                                        >
                                                                            Assign to Department
                                                                        </button>

                                                                        <button
                                                                            onClick={() => changePriority(issue.id)}
                                                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                                                                        >
                                                                            Change Priority
                                                                        </button>

                                                                        <button
                                                                            onClick={() => updateStatus(issue.id)}
                                                                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                                                                        >
                                                                            Update Status
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
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
            </div>
        </div>
    );
}