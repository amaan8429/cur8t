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
import {
  PiGithubLogo,
  PiCheckCircle,
  PiWarningCircle,
  PiArrowSquareOut,
  PiSpinner,
} from "react-icons/pi";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface GitHubStatus {
  githubConnected: boolean;
  lastSync?: string;
  repositoryUrl?: string;
  username?: string;
}

const GitHubIntegrationComponent = () => {
  const [githubStatus, setGithubStatus] = React.useState<GitHubStatus | null>(
    null
  );
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleConnectGitHub = () => {
    window.location.href = "/api/github/connect";
  };

  const handleDisconnectGitHub = async () => {
    setIsDisconnecting(true);
    try {
      const response = await fetch("/api/github/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setGithubStatus({ githubConnected: false });
        toast({
          title: "Success",
          description: "GitHub account disconnected successfully",
        });
      } else {
        throw new Error("Failed to disconnect");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect GitHub account",
        variant: "destructive",
      });
    } finally {
      setIsDisconnecting(false);
    }
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

      // Check for rate limiting first
      if (response.status === 429) {
        const data = await response.json();
        const retryAfter =
          response.headers.get("retry-after") || data.retryAfter || 60;

        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter:
            typeof retryAfter === "string"
              ? parseInt(retryAfter) * 60
              : retryAfter * 60,
          message: "Too many GitHub sync attempts. Please try again later.",
        });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to sync with GitHub",
          variant: "destructive",
        });
        return;
      }

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
        // Update last sync time
        setGithubStatus((prev) =>
          prev ? { ...prev, lastSync: new Date().toISOString() } : null
        );
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

      // Check for rate limiting first
      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        const retryAfter =
          response.headers.get("retry-after") || data.retryAfter || 60;

        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter:
            typeof retryAfter === "string"
              ? parseInt(retryAfter) * 60
              : retryAfter * 60,
          message: "Too many GitHub status requests. Please try again later.",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub status");
      }
      const data = await response.json();
      setGithubStatus(data);
    } catch (error) {
      console.log("Error checking GitHub status:", error);
      toast({
        title: "Error",
        description: "Failed to check GitHub connection status",
        variant: "destructive",
      });
      setGithubStatus({ githubConnected: false });
    }
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return "Never";
    const date = new Date(lastSync);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  React.useEffect(() => {
    checkGithubStatus();
  }, []);

  if (githubStatus === null) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PiGithubLogo className="h-6 w-6" />
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>GitHub Integration</CardTitle>
                {githubStatus.githubConnected ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <PiCheckCircle className="h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <PiWarningCircle className="h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
              </div>
              <CardDescription>
                {githubStatus.githubConnected
                  ? `Connected as ${githubStatus.username || "User"} • Auto-sync your collections`
                  : "Connect your GitHub account to sync collections automatically"}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {githubStatus.githubConnected && (
            <>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Last Sync</p>
                  <p className="text-sm text-muted-foreground">
                    {formatLastSync(githubStatus.lastSync)}
                  </p>
                </div>
                {githubStatus.repositoryUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(githubStatus.repositoryUrl, "_blank")
                    }
                    className="flex items-center gap-2"
                  >
                    <PiArrowSquareOut className="h-4 w-4" />
                    View Repository
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={async () => {
                    if (!user?.id) {
                      return toast({
                        title: "Error",
                        description: "User ID not found",
                        variant: "destructive",
                      });
                    }
                    await syncToGithub(user.id);
                  }}
                  disabled={isSyncing}
                  className="flex-1"
                >
                  {isSyncing ? (
                    <>
                      <PiSpinner className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Sync Now"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDisconnectGitHub}
                  disabled={isDisconnecting}
                  className="px-4"
                >
                  {isDisconnecting ? (
                    <PiSpinner className="h-4 w-4 animate-spin" />
                  ) : (
                    "Disconnect"
                  )}
                </Button>
              </div>
            </>
          )}

          {!githubStatus.githubConnected && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold">Auto-Sync</div>
                  <div className="text-xs text-muted-foreground">Every 24h</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold">2-Way Sync</div>
                  <div className="text-xs text-muted-foreground">
                    Bidirectional
                  </div>
                </div>
              </div>

              <Button onClick={handleConnectGitHub} className="w-full">
                <PiGithubLogo className="mr-2 h-4 w-4" />
                Connect GitHub
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubIntegrationComponent;
