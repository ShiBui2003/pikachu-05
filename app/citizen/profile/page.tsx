"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import LocationPicker from "@/components/location-picker";
import PhoneInput from "@/components/phone-input";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Upload,
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react";

interface ProfileData {
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  location_coordinates?: { lat: number; lng: number };
  avatar_url?: string;
  email_notifications: boolean;
  push_notifications: boolean;
  privacy_public_profile: boolean;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        full_name: "",
        email: "",
        phone: "",
        bio: "",
        location: "",
        location_coordinates: undefined,
        avatar_url: "",
        email_notifications: true,
        push_notifications: true,
        privacy_public_profile: true
    });
    const [issueStats, setIssueStats] = useState({
        reported: 0,
        resolved: 0,
        in_progress: 0
    });

    useEffect(() => {
        if (user) {
            fetchProfileData();
            fetchIssueStats();
        }
    }, [user]);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/profile', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setProfileData({
                    full_name: data.profile?.full_name || user?.user_metadata?.full_name || "",
                    email: user?.email || "",
                    phone: data.profile?.phone || "",
                    bio: data.profile?.bio || "",
                    location: data.profile?.location || "",
                    location_coordinates: data.profile?.location_coordinates || undefined,
                    avatar_url: data.profile?.avatar_url || "",
                    email_notifications: data.profile?.email_notifications ?? true,
                    push_notifications: data.profile?.push_notifications ?? true,
                    privacy_public_profile: data.profile?.privacy_public_profile ?? true
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchIssueStats = async () => {
        try {
            const response = await fetch('/api/profile/stats', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setIssueStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                toast({
                    title: "Profile updated",
                    description: "Your profile has been successfully updated."
                });
                setIsEditing(false);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/avatar', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(prev => ({ ...prev, avatar_url: data.url }));
                toast({
                    title: "Avatar updated",
                    description: "Your profile picture has been updated."
                });
            } else {
                throw new Error('Failed to upload avatar');
            }
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "Failed to upload avatar. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const displayName = profileData.full_name || user?.email?.split("@")[0] || "User";

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account information and settings</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Overview */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <Avatar className="w-24 h-24">
                                        {profileData.avatar_url ? (
                                            <AvatarImage src={profileData.avatar_url} alt={displayName} />
                                        ) : (
                                            <AvatarFallback className="text-2xl">
                                                {displayName.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    {isEditing && (
                                        <div className="absolute -bottom-2 -right-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleAvatarUpload(file);
                                                }}
                                                className="hidden"
                                                id="avatar-upload"
                                            />
                                            <label
                                                htmlFor="avatar-upload"
                                                className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
                                            >
                                                {uploading ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Camera className="w-4 h-4" />
                                                )}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                
                                <h2 className="text-xl font-semibold mb-2">{displayName}</h2>
                                <p className="text-muted-foreground mb-4">{profileData.email}</p>
                                <Badge variant="secondary" className="mb-4">
                                    Citizen
                                </Badge>
                                
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button onClick={handleSave} disabled={loading} size="sm">
                                            <Save className="w-4 h-4 mr-2" />
                                            {loading ? "Saving..." : "Save"}
                                        </Button>
                                        <Button 
                                            onClick={() => setIsEditing(false)} 
                                            variant="outline" 
                                            size="sm"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Activity Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Issues Reported</span>
                                    <Badge variant="outline">{issueStats.reported}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">In Progress</span>
                                    <Badge variant="secondary">{issueStats.in_progress}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Resolved</span>
                                    <Badge variant="default">{issueStats.resolved}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    {isEditing ? (
                                        <Input
                                            id="full_name"
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <p className="text-muted-foreground">{profileData.full_name || "Not provided"}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <p className="text-muted-foreground">{profileData.email}</p>
                                    <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
                                </div>
                                
                                <div className="space-y-2">
                                    {isEditing ? (
                                        <PhoneInput
                                            value={profileData.phone || ""}
                                            onChange={(value) => setProfileData(prev => ({ ...prev, phone: value }))}
                                            label="Phone Number"
                                            placeholder="Enter 10-digit mobile number"
                                        />
                                    ) : (
                                        <>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <p className="text-muted-foreground">
                                                {profileData.phone ? `+91 ${profileData.phone}` : "Not provided"}
                                            </p>
                                        </>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    {isEditing ? (
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <LocationPicker
                                                value={profileData.location || ""}
                                                onChange={(location, coordinates) => 
                                                    setProfileData(prev => ({ 
                                                        ...prev, 
                                                        location,
                                                        location_coordinates: coordinates 
                                                    }))
                                                }
                                                placeholder="Enter your city/area"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <Label htmlFor="location">Location</Label>
                                            <p className="text-muted-foreground">{profileData.location || "Not provided"}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                {isEditing ? (
                                    <Textarea
                                        id="bio"
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-muted-foreground">{profileData.bio || "No bio provided"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notification Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive updates about your issues via email</p>
                                </div>
                                <Switch
                                    checked={profileData.email_notifications}
                                    onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, email_notifications: checked }))}
                                    disabled={!isEditing}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive instant notifications in your browser</p>
                                </div>
                                <Switch
                                    checked={profileData.push_notifications}
                                    onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, push_notifications: checked }))}
                                    disabled={!isEditing}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Privacy Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Public Profile</p>
                                    <p className="text-sm text-muted-foreground">Allow others to see your profile information</p>
                                </div>
                                <Switch
                                    checked={profileData.privacy_public_profile}
                                    onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, privacy_public_profile: checked }))}
                                    disabled={!isEditing}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Account Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Change Password</p>
                                    <p className="text-sm text-muted-foreground">Update your account password</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Change Password
                                </Button>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Download Data</p>
                                    <p className="text-sm text-muted-foreground">Download a copy of your account data</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-red-600">Delete Account</p>
                                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}