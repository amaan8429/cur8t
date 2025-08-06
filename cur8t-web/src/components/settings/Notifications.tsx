"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  getAccessRequestsAction,
  approveAccessRequestAction,
  denyAccessRequestAction,
} from "@/actions/collection/accessRequests";
import {
  PiCheck,
  PiX,
  PiChatCircle,
  PiClock,
  PiShield,
  PiLock,
} from "react-icons/pi";
import Link from "next/link";

interface AccessRequest {
  id: string;
  requesterId: string;
  collectionId: string;
  message: string;
  status: string;
  requestedAt: Date;
  respondedAt: Date | null;
  requesterName: string | null;
  requesterEmail: string | null;
  collectionTitle: string | null;
}

export default function Notifications() {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast, success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    fetchAccessRequests();
  }, []);

  const fetchAccessRequests = async () => {
    setIsLoading(true);
    try {
      const result = await getAccessRequestsAction();
      if (result.success && result.data) {
        setAccessRequests(
          result.data.map((req) => ({
            ...req,
            requestedAt: new Date(req.requestedAt),
            respondedAt: req.respondedAt ? new Date(req.respondedAt) : null,
          }))
        );
      } else {
        toastError({
          title: "Failed to load notifications",
          description: result.error || "Could not fetch access requests",
        });
      }
    } catch (error) {
      console.error("Error fetching access requests:", error);
      toastError({
        title: "Error",
        description: "Something went wrong while loading notifications",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const result = await approveAccessRequestAction(requestId);
      if (result.success) {
        toastSuccess({
          title: "Access Approved",
          description:
            result.message || "The user now has access to your collection",
        });
        // Update local state
        setAccessRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? { ...req, status: "approved", respondedAt: new Date() }
              : req
          )
        );
      } else {
        toastError({
          title: "Failed to approve",
          description: result.error || "Could not approve access request",
        });
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toastError({
        title: "Error",
        description: "Something went wrong while approving the request",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const result = await denyAccessRequestAction(requestId);
      if (result.success) {
        toastSuccess({
          title: "Access Denied",
          description: "The access request has been denied",
        });
        // Update local state
        setAccessRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? { ...req, status: "denied", respondedAt: new Date() }
              : req
          )
        );
      } else {
        toastError({
          title: "Failed to deny",
          description: result.error || "Could not deny access request",
        });
      }
    } catch (error) {
      console.error("Error denying request:", error);
      toastError({
        title: "Error",
        description: "Something went wrong while denying the request",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground border-muted"
          >
            <PiClock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20"
          >
            <PiCheck className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "denied":
        return (
          <Badge
            variant="secondary"
            className="bg-destructive/10 text-destructive border-destructive/20"
          >
            <PiX className="h-3 w-3 mr-1" />
            Denied
          </Badge>
        );
      default:
        return null;
    }
  };

  const pendingRequests = accessRequests.filter(
    (req) => req.status === "pending"
  );
  const respondedRequests = accessRequests.filter(
    (req) => req.status !== "pending"
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {accessRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PiChatCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              When people request access to your private or protected
              collections, you&apos;ll see their requests here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Pending Requests ({pendingRequests.length})
              </h3>
              {pendingRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-l-4 border-l-muted-foreground/50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {request.requesterName?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">
                            {request.requesterName || "Unknown User"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            wants access to{" "}
                            <Link
                              href={`/collection/${request.collectionId}`}
                              className="font-medium text-primary hover:underline"
                            >
                              &ldquo;
                              {request.collectionTitle || "Unknown Collection"}
                              &rdquo;
                            </Link>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.requestedAt.toLocaleDateString()} at{" "}
                            {request.requestedAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {request.message && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium mb-1">Message:</p>
                        <p className="text-sm text-muted-foreground">
                          &ldquo;{request.message}&rdquo;
                        </p>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === request.id}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <PiCheck className="h-4 w-4 mr-2" />
                        {actionLoading === request.id
                          ? "Approving..."
                          : "Approve"}
                      </Button>
                      <Button
                        onClick={() => handleDeny(request.id)}
                        disabled={actionLoading === request.id}
                        variant="outline"
                        size="sm"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10 dark:border-destructive/40 dark:text-destructive dark:hover:bg-destructive/20"
                      >
                        <PiX className="h-4 w-4 mr-2" />
                        {actionLoading === request.id ? "Denying..." : "Deny"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Responded Requests */}
          {respondedRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Previous Requests ({respondedRequests.length})
              </h3>
              {respondedRequests.map((request) => (
                <Card key={request.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {request.requesterName?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">
                            {request.requesterName || "Unknown User"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            requested access to &ldquo;
                            {request.collectionTitle || "Unknown Collection"}
                            &rdquo;
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Responded{" "}
                            {request.respondedAt?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  {request.message && (
                    <CardContent>
                      <div className="p-2 bg-muted/30 rounded text-xs">
                        <span className="font-medium">Message: </span>
                        <span className="text-muted-foreground">
                          &ldquo;{request.message}&rdquo;
                        </span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
