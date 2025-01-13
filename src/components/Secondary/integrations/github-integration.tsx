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
import { Github, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const GitHubIntegrationComponent = () => {
  const [githubConnected, setGithubConnected] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleConnectGitHub = () => {
    window.location.href = "/api/github/connect";
  };

  const syncToGithub = async (id: string) => {
    setIsSyncing(true);
    toast({
      title: "Syncing",
      description: "Syncing your collections to GitHub...",
    });

    try {
      const response = await fetch("/api/github/sync", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to sync with GitHub",
          variant: "destructive",
        });
        return;
      }

      // Handle different response types
      if (data.status === "info") {
        toast({
          title: "Info",
          description: data.message,
        });
      } else if (data.status === "success") {
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
      }

      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync with GitHub",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const checkGithubStatus = async () => {
    try {
      const response = await fetch("/api/github/status");
      const data = await response.json();
      setGithubConnected(data.githubConnected);
    } catch (error) {
      console.error("Error checking GitHub status:", error);
      toast({
        title: "Error",
        description: "Failed to check GitHub connection status",
        variant: "destructive",
      });
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
              variant={"destructive"}
              onClick={async () => {
                if (!user || !user.id) {
                  return toast({
                    title: "Error",
                    description: "User ID not found",
                    variant: "destructive",
                  });
                }
                await syncToGithub(user.id);
              }}
              className="w-full"
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                "Sync GitHub"
              )}
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
