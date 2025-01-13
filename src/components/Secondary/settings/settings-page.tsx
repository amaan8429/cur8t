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
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import GeneralSettings from "./general-settings";
import Logout from "./logout";
import LoadingSettings from "./loading";

const SettingsPage = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial state with null values
  const [initialState, setInitialState] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
  });

  // Current state with null values
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [avatar, setAvatar] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  // Update state when user data is loaded
  React.useEffect(() => {
    if (isLoaded && user) {
      const newState = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        avatar: user.imageUrl || "",
      };

      setInitialState(newState);
      setFirstName(newState.firstName);
      setLastName(newState.lastName);
      setEmail(newState.email);
      setAvatar(newState.avatar);
    }
  }, [isLoaded, user]);

  // Check if any changes were made
  const hasChanges = React.useMemo(() => {
    return (
      firstName !== initialState.firstName || lastName !== initialState.lastName
    );
  }, [firstName, lastName, initialState]);

  const handleSave = async () => {
    if (!user) return;

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

      // Update in our database
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

      // Update initial state with current values
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
    if (!file || !user) return;

    setIsUploadingAvatar(true);
    const loadingToast = toast({
      title: "Uploading avatar",
      description: "Please wait while we update your profile picture...",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload to Clerk
      const result = await user.setProfileImage({
        file,
      });

      // Update local state with new avatar URL
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
      // Clear the input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    <LoadingSettings />;
  }

  return (
    <div className="mx-auto p-6 space-y-8">
      {/* Profile Settings Section */}
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

          {/* Rest of the component remains the same */}

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

      <GeneralSettings />
    </div>
  );
};

export default SettingsPage;
