"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const GitHubIntegrationComponent = () => {
  const [githubConnected, setGithubConnected] = React.useState(false);
  const { toast } = useToast();

  const { user } = useUser();

  const handleConnectGitHub = () => {
    console.log("Connect GitHub");
    window.location.href = "/api/github/connect";
  };

  const syncToGithub = async (id: string) => {
    console.log("userId", id);
    const response = await fetch("/api/github/sync", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });

    const data = await response.json();
    if (data.error) {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    }

    if (data.success) {
      toast({
        title: "Success",
        description: "Synced to GitHub",
        variant: "default",
      });
    }

    return data;
  };

  const checkGithubStatus = async () => {
    try {
      const response = await fetch("/api/github/status");
      const data = await response.json();
      setGithubConnected(data.githubConnected);
    } catch (error) {
      console.log("Error checking GitHub status:", error);
    }
  };

  React.useEffect(() => {
    checkGithubStatus();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Github className="h-6 w-6" />
          <div>
            <CardTitle>Connect GitHub</CardTitle>
            <CardDescription>
              Connect your GitHub account to manage your repositories.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Auto-sync repositories
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Track changes
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Manage permissions
            </li>
          </ul>
          {githubConnected ? (
            <Button
              onClick={async () => {
                if (!user || !user.id) {
                  return toast({
                    title: "Error",
                    description: "User ID not found",
                    variant: "destructive",
                  });
                }
                const data = await syncToGithub(user.id);
                console.log("Sync to GitHub:", data);
              }}
              className="w-full"
            >
              Sync GitHub
            </Button>
          ) : (
            <Button onClick={handleConnectGitHub} className="w-full">
              Connect GitHub
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubIntegrationComponent;
