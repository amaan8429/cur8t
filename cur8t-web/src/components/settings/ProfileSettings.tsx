/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import { User, Mail, Save, Camera } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import Logout from "./Logout";

interface ProfileSettingsProps {
  user: any;
}

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial state
  const [initialState, setInitialState] = React.useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.primaryEmailAddress?.emailAddress || "",
    avatar: user.imageUrl || "",
  });

  // Current state
  const [firstName, setFirstName] = React.useState(initialState.firstName);
  const [lastName, setLastName] = React.useState(initialState.lastName);
  const [email, setEmail] = React.useState(initialState.email);
  const [avatar, setAvatar] = React.useState(initialState.avatar);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  // Check if any changes were made
  const hasChanges = React.useMemo(() => {
    return (
      firstName !== initialState.firstName || lastName !== initialState.lastName
    );
  }, [firstName, lastName, initialState]);

  const handleSave = async () => {
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
        variant: "default",
      });
    } catch (error) {
      console.log("Error saving changes:", error);
      loadingToast.dismiss();
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
        variant: "default",
      });
    } catch (error) {
      console.log("Error uploading avatar:", error);
      loadingToast.dismiss();
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your personal information and account settings
        </CardDescription>
        {hasChanges && (
          <div className="absolute right-6 top-6">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
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
          >
            {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              disabled
            />
          </div>
        </div>

        <Separator />
        <Logout />
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
