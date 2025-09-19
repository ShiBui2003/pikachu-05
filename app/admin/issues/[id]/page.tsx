"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, MapPin, Calendar, User, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";

const GoogleMap = dynamic(() => import("@/components/interactive-map"), {
    ssr: false,
    loading: () => <div className="h-96 bg-muted rounded-md animate-pulse" />
});

type Issue = {
    id: string;
    title: string;
    description?: string;
    category: string;
    status: string;
    priority: string;
    location_address?: string;
    created_at: string;
    profiles?: { 
        full_name: string; 
        email: string; 
    };
    assigned_profile?: { 
        full_name: string; 
        email: string; 
    };
    assigned_to?: string;
    estimated_completion?: string;
    coordinates?: { lat: number; lng: number } | null;
    image_url?: string;
    votes_count?: number;
    comments_count?: number;
};

type Profile = {
    id: string;
    full_name: string;
    email: string;
    role?: string;
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

export default function AdminIssueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    
    const [issue, setIssue] = useState<Issue | null>(null);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [status, setStatus] = useState("");
    const [estimatedCompletion, setEstimatedCompletion] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIssue = async () => {
        if (!id) {
            setError("Issue ID not found");
            setLoading(false);
            return;
        }

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
                .eq("id", id)
                .single();

            if (fetchError) {
                throw fetchError;
            }

            if (!data) {
                throw new Error("Issue not found");
            }

            // Safely cast only if data is not null
            const issueData = data as Issue;

            setIssue(issueData);
            setStatus(issueData.status || "submitted");
            setEstimatedCompletion(issueData.estimated_completion || "");
            setAssignedUserId(issueData.assigned_to || "unassigned");
        } catch (err: any) {
            console.error("Error fetching issue:", err);
            setError(err.message || "Failed to load issue");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfiles = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, email, role")
                .eq("role", "admin")
                .order("full_name");

            if (error) {
                console.error("Error fetching profiles:", error);
                return;
            }

            setProfiles(data || []);
        } catch (err) {
            console.error("Error fetching profiles:", err);
        }
    };

    useEffect(() => {
        fetchIssue();
        fetchProfiles();
    }, [id]);

    const handleUpdate = async () => {
        if (!issue) return;

        try {
            setUpdating(true);
            
            const updateData: any = {
                status,
                estimated_completion: estimatedCompletion || null,
                assigned_to: assignedUserId === "unassigned" ? null : assignedUserId,
                updated_at: new Date().toISOString(),
            };
            
            const { error } = await supabase
                .from("issues")
                .update(updateData)
                .eq("id", issue.id);

            if (error) {
                throw error;
            }

            // Refresh the issue data
            await fetchIssue();
            
            toast({
                title: "Success",
                description: "Issue updated successfully",
            });
        } catch (err: any) {
            console.error("Error updating issue:", err);
            toast({
                title: "Error",
                description: err.message || "Failed to update issue",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <div className="h-8 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="text-center py-8">
                        <div className="text-red-500 mb-4">
                            {error || "Issue not found"}
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            {/* Header */}
            <div className="mb-6">
                <Button 
                    variant="outline" 
                    className="mb-4"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold">{issue.title}</h1>
                <p className="text-muted-foreground mt-2">Issue ID: {issue.id}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Issue Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Issue Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge className={getStatusColor(issue.status)}>
                                    <Clock className="w-3 h-3 mr-1" />
                                    {issue.status.replace(/[_-]/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                                <Badge className={getPriorityColor(issue.priority || "medium")}>
                                    {(issue.priority || "medium").toUpperCase()} Priority
                                </Badge>
                                <Badge variant="outline">
                                    {getCategoryLabel(issue.category)}
                                </Badge>
                            </div>

                            {issue.description && (
                                <div>
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {issue.description}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center text-sm">
                                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span>{issue.location_address || "Location not specified"}</span>
                                </div>
                                
                                <div className="flex items-center text-sm">
                                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span>
                                        Reported: {new Date(issue.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span>
                                        Reporter: {issue.profiles?.full_name || "Anonymous"}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span>
                                        Assigned: {issue.assigned_profile?.full_name || "Unassigned"}
                                    </span>
                                </div>
                            </div>

                            {issue.image_url && (
                                <div>
                                    <h4 className="font-semibold mb-2">Image</h4>
                                    <img
                                        src={issue.image_url}
                                        alt="Issue"
                                        className="max-w-full h-auto rounded-md border"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Map */}
                    {issue.coordinates && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Location</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <GoogleMap
                                    lat={issue.coordinates.lat}
                                    lng={issue.coordinates.lng}
                                    markerLabel={issue.title}
                                    height={400}
                                    width="100%"
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Issue</CardTitle>
                            <CardDescription>
                                Modify the status, assignment, and timeline
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Status
                                </label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="submitted">Submitted</SelectItem>
                                        <SelectItem value="in-review">In Review</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Assign To
                                </label>
                                <Select
                                    value={assignedUserId}
                                    onValueChange={setAssignedUserId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">Unassigned</SelectItem>
                                        {profiles.map((profile) => (
                                            <SelectItem key={profile.id} value={profile.id}>
                                                {profile.full_name} ({profile.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Estimated Completion
                                </label>
                                <Input
                                    type="date"
                                    value={estimatedCompletion}
                                    onChange={(e) => setEstimatedCompletion(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="w-full"
                            >
                                {updating ? "Updating..." : "Update Issue"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Issue Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Votes:</span>
                                <span>{issue.votes_count || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Comments:</span>
                                <span>{issue.comments_count || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Created:</span>
                                <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}