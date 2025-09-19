"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, MapPin, Phone, Edit } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuth();
    
    const displayName =
        (user?.user_metadata as any)?.full_name ||
        (user?.user_metadata as any)?.name ||
        (user?.email ? String(user.email).split("@")[0] : undefined) ||
        "User";

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Overview */}
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="w-24 h-24 mb-4">
                                    <AvatarFallback className="text-2xl">
                                        {String(displayName).substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-semibold mb-2">{displayName}</h2>
                                <p className="text-muted-foreground mb-4">{user?.email}</p>
                                <Badge variant="secondary" className="mb-4">
                                    Citizen
                                </Badge>
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Full Name</p>
                                    <p className="text-muted-foreground">{displayName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Member Since</p>
                                    <p className="text-muted-foreground">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-primary">0</p>
                                    <p className="text-sm text-muted-foreground">Issues Reported</p>
                                </div>
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">0</p>
                                    <p className="text-sm text-muted-foreground">Issues Resolved</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive updates about your issues</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Configure
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Privacy Settings</p>
                                    <p className="text-sm text-muted-foreground">Manage your data and privacy</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Manage
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}