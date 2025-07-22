/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useEffect } from "react";
import {
  User,
  Mail,
  Save,
  Camera,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Logout from "./Logout";

interface ProfileSettingsProps {
  user: any;
}

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [initialState, setInitialState] = React.useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.primaryEmailAddress?.emailAddress || "",
    avatar: user.imageUrl || "",
  });

  const [firstName, setFirstName] = React.useState(initialState.firstName);
  const [lastName, setLastName] = React.useState(initialState.lastName);
  const [email, setEmail] = React.useState(initialState.email);
  const [avatar, setAvatar] = React.useState(initialState.avatar);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  // Username state
  const [currentUsername, setCurrentUsername] = React.useState("");
  const [newUsername, setNewUsername] = React.useState("");
  const [isLoadingUsername, setIsLoadingUsername] = React.useState(true);
  const [isSavingUsername, setIsSavingUsername] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/user/info");
      const data = await response.json();

      if (data.username) {
        setCurrentUsername(data.username);
        setNewUsername(data.username);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setIsLoadingUsername(false);
    }
  };

  // Check if any changes were made
  const hasProfileChanges = React.useMemo(() => {
    return (
      firstName !== initialState.firstName || lastName !== initialState.lastName
    );
  }, [firstName, lastName, initialState]);

  const hasUsernameChanged =
    newUsername !== currentUsername && newUsername.length >= 3;

  const handleProfileSave = async () => {
    setIsSaving(true);
    const loadingToast = toast({
      title: "Saving changes",
      description: "Please wait while we update your profile...",
    });

    try {
      await user.update({
        firstName,
        lastName,
      });

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      setInitialState({
        firstName,
        lastName,
        email,
        avatar,
      });

      loadingToast.dismiss();
      toast({
        title: "Success",
        description: "Your changes have been saved.",
        className: "bg-primary border-primary text-primary-foreground",
      });
    } catch (error) {
      console.log("Error saving changes:", error);
      loadingToast.dismiss();
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        className: "bg-primary border-primary text-primary-foreground",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername || newUsername === currentUsername) return;

    setIsSavingUsername(true);
    const loadingToast = toast({
      title: "Updating username",
      description: "Please wait while we update your username...",
    });

    try {
      const response = await fetch("/api/user/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          loadingToast.dismiss();
          toast({
            title: "Too many requests, try again later",
            description:
              "Please wait before attempting another username change.",
          });
          return;
        }

        throw new Error(data.error || "Failed to update username");
      }

      setCurrentUsername(newUsername);
      loadingToast.dismiss();
      toast({
        title: "Success",
        description: "Username updated successfully.",
        className: "bg-primary border-primary text-primary-foreground",
      });
    } catch (error) {
      console.error("Error updating username:", error);
      loadingToast.dismiss();
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update username",
        className: "bg-primary border-primary text-primary-foreground",
      });
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const loadingToast = toast({
      title: "Uploading avatar",
      description: "Please wait while we update your profile picture...",
    });

    try {
      const result = await user.setProfileImage({
        file,
      });

      if (result.publicUrl) {
        setAvatar(result.publicUrl);
      }

      loadingToast.dismiss();
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
        className: "bg-primary border-primary text-primary-foreground",
      });
    } catch (error) {
      console.log("Error uploading avatar:", error);
      loadingToast.dismiss();
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        className: "bg-primary border-primary text-primary-foreground",
      });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCopyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${currentUsername}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: "Profile link copied",
      description: "Share your profile with others!",
      className: "bg-primary border-primary text-primary-foreground",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${currentUsername}`;
    window.open(profileUrl, "_blank");
  };

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${currentUsername}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Personal information and username</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} alt="Profile" />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Camera className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isUploadingAvatar}
          />
          <Button
            variant="outline"
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/10"
          >
            <Camera className="h-4 w-4" />
            {isUploadingAvatar ? "Uploading..." : "Change Photo"}
          </Button>
        </div>

        <Separator />

        {/* Name Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>
          {hasProfileChanges && (
            <div className="flex justify-end">
              <Button
                onClick={handleProfileSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2">
            <Input id="email" value={email} disabled className="bg-muted" />
            <Button variant="outline" size="icon" disabled>
              <Mail className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Email managed through your account provider
          </p>
        </div>

        <Separator />

        {/* Username Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              {currentUsername && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-primary/20 text-primary"
                >
                  Current: @{currentUsername}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              3+ characters, letters/numbers/underscores only
            </p>
          </div>
          {hasUsernameChanged && (
            <div className="flex justify-end">
              <Button
                onClick={handleUsernameUpdate}
                disabled={isSavingUsername}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                {isSavingUsername ? "Updating..." : "Update Username"}
              </Button>
            </div>
          )}

          {currentUsername && (
            <div className="space-y-2">
              <Label>Profile URL</Label>
              <div className="flex gap-2">
                <Input value={profileUrl} readOnly className="bg-muted" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyProfileLink}
                  disabled={copied}
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleOpenProfile}
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Public profile link
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Logout Section */}
        <Logout />
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
