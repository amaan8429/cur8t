"use client";

import React, { useState, useEffect } from "react";
import { User, Copy, ExternalLink, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const UsernameSettings = () => {
  const { toast } = useToast();
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setIsLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername || newUsername === currentUsername) return;

    setIsSaving(true);
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
        throw new Error(data.error || "Failed to update username");
      }

      setCurrentUsername(newUsername);
      loadingToast.dismiss();
      toast({
        title: "Success",
        description: "Username updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating username:", error);
      loadingToast.dismiss();
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update username",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${currentUsername}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: "Profile link copied",
      description: "Share your profile with others!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${currentUsername}`;
    window.open(profileUrl, "_blank");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Username & Profile</CardTitle>
          <CardDescription>Loading username information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasUsernameChanged =
    newUsername !== currentUsername && newUsername.length >= 3;
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${currentUsername}`;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Username & Profile
        </CardTitle>
        <CardDescription>
          Manage your username and share your public profile
        </CardDescription>
        {hasUsernameChanged && (
          <div className="absolute right-6 top-6">
            <Button
              onClick={handleUsernameUpdate}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? "Updating..." : "Update Username"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
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
              <Badge variant="outline" className="flex items-center gap-1">
                Current: @{currentUsername}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Username must be at least 3 characters and can only contain letters,
            numbers, and underscores.
          </p>
        </div>

        {currentUsername && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Your Profile URL</Label>
              <div className="flex gap-2">
                <Input value={profileUrl} readOnly className="bg-muted" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyProfileLink}
                  disabled={copied}
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
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this link to let others view your public collections.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsernameSettings;
