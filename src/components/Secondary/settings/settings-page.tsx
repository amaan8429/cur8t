"use client";

import React from "react";
import { User, Mail, Moon, LogOut, Save } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";

const SettingsPage = () => {
  const { user } = useUser();
  // Initial state
  const [initialState, setInitialState] = React.useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl,
  });

  // Current state
  const [firstName, setFirstName] = React.useState(
    initialState.firstName || ""
  );
  const [lastName, setLastName] = React.useState(initialState.lastName || "");
  const [email, setEmail] = React.useState(initialState.email || "");
  const [avatar, setAvatar] = React.useState(initialState.avatar || "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const { theme, setTheme } = useTheme();

  // Check if any changes were made
  const hasChanges = React.useMemo(() => {
    return (
      firstName !== initialState.firstName ||
      lastName !== initialState.lastName ||
      email !== initialState.email ||
      avatar !== initialState.avatar
    );
  }, [firstName, lastName, email, avatar, initialState]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update initial state with current values
      setInitialState({
        firstName,
        lastName,
        email,
        avatar,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="mx-auto p-6 space-y-8">
      {saveSuccess && (
        <Alert variant={saveSuccess ? "default" : "destructive"}>
          <AlertDescription>Changes saved successfully!</AlertDescription>
        </Alert>
      )}

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
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} alt="Profile" />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Avatar</Button>
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
              />
            </div>
          </div>

          <Separator />

          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* General Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle dark mode theme
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
