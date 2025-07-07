"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Server,
  Activity,
} from "lucide-react";
import { agentsApi, AgentsApiError } from "@/lib/api/agents";

interface ApiStatusIndicatorProps {
  className?: string;
}

interface ApiStatus {
  isConnected: boolean;
  isLoading: boolean;
  error?: string;
  apiInfo?: {
    message: string;
    version: string;
    description: string;
    agents: Array<{
      name: string;
      description: string;
      status: string;
    }>;
  };
  health?: {
    status: string;
    service: string;
    version: string;
  };
}

export function ApiStatusIndicator({ className }: ApiStatusIndicatorProps) {
  const [status, setStatus] = useState<ApiStatus>({
    isConnected: false,
    isLoading: false,
  });
  const [showDetails, setShowDetails] = useState(false);

  const checkApiStatus = async () => {
    setStatus((prev) => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const [apiInfo, health] = await Promise.all([
        agentsApi.getApiInfo(),
        agentsApi.checkHealth(),
      ]);

      setStatus({
        isConnected: true,
        isLoading: false,
        apiInfo,
        health,
      });
    } catch (error) {
      console.error("API status check failed:", error);
      setStatus({
        isConnected: false,
        isLoading: false,
        error:
          error instanceof AgentsApiError
            ? error.message
            : "Failed to connect to agents API",
      });
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const getStatusIcon = () => {
    if (status.isLoading) {
      return <Loader2 className="h-3 w-3 animate-spin" />;
    }

    if (status.isConnected) {
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    }

    return <XCircle className="h-3 w-3 text-red-600" />;
  };

  const getStatusText = () => {
    if (status.isLoading) return "Checking...";
    if (status.isConnected) return "Connected";
    return "Disconnected";
  };

  const getStatusVariant = ():
    | "default"
    | "secondary"
    | "destructive"
    | "outline" => {
    if (status.isLoading) return "secondary";
    if (status.isConnected) return "default";
    return "destructive";
  };

  return (
    <div className={className}>
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto p-1">
            <Badge
              variant={getStatusVariant()}
              className="flex items-center gap-1 text-xs"
            >
              {getStatusIcon()}
              API {getStatusText()}
            </Badge>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Agents API Status
            </DialogTitle>
            <DialogDescription>
              Connection status about cur8t agents API
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Connection Status */}

            {/* API Information */}
            {status.apiInfo && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">API Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Service:</span>
                    <span>{status.apiInfo.message}</span>

                    <span className="text-muted-foreground">Version:</span>
                    <span>{status.apiInfo.version}</span>

                    <span className="text-muted-foreground">Agents:</span>
                    <span>{status.apiInfo.agents.length} available</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Agents */}
            {status.apiInfo?.agents && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Available Agents</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {status.apiInfo.agents.map((agent, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="text-sm font-medium">
                          {agent.name}
                        </span>
                        <Badge
                          variant={
                            agent.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {agent.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Connection Info */}
            {!status.isConnected && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Connection Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      To use AI agents, make sure the Agents API is running:
                    </p>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs">
                      cd agents-api
                      <br />
                      uvicorn main:app --reload
                    </div>
                    <p>
                      The API should be available at{" "}
                      <code className="bg-muted px-1 rounded">
                        http://localhost:8000
                      </code>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
