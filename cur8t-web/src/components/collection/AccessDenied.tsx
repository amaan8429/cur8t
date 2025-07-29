import React, { useState, useEffect } from "react";
import { Lock, Shield, LogIn, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { AccessRequestDialog } from "./AccessRequestDialog";
import { checkAccessRequestStatus } from "@/actions/collection/accessRequests";

interface AccessDeniedProps {
  error: string;
  collectionTitle?: string;
  collectionId?: string;
}

export function AccessDenied({
  error,
  collectionTitle,
  collectionId,
}: AccessDeniedProps) {
  const { isSignedIn } = useAuth();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<{
    hasRequest: boolean;
    status?: string;
    requestedAt?: Date;
  }>({ hasRequest: false });
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Determine the type of error and appropriate icon/action
  const isPrivateError = error.includes("private");
  const isProtectedError = error.includes("protected");
  const needsAuth = error.includes("sign in");
  const canShowRequestButton =
    (isPrivateError || isProtectedError) && !!collectionId;
  const canActuallyRequest = canShowRequestButton && isSignedIn;

  // Use provided title or fallback
  const finalCollectionTitle = collectionTitle || "this collection";

  useEffect(() => {
    const checkStatus = async () => {
      if (canActuallyRequest && collectionId) {
        setIsCheckingStatus(true);
        try {
          const status = await checkAccessRequestStatus(collectionId);
          setRequestStatus(status);
        } catch (error) {
          console.error("Error checking access request status:", error);
        } finally {
          setIsCheckingStatus(false);
        }
      } else {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [canActuallyRequest, collectionId]);

  const getIcon = () => {
    if (isPrivateError)
      return <Lock className="h-12 w-12 text-muted-foreground" />;
    if (isProtectedError)
      return <Shield className="h-12 w-12 text-muted-foreground" />;
    return <LogIn className="h-12 w-12 text-muted-foreground" />;
  };

  const getTitle = () => {
    if (isPrivateError) return "Private Collection";
    if (isProtectedError) return "Protected Collection";
    return "Access Required";
  };

  const getDescription = () => {
    if (isPrivateError) {
      return "This collection is private and can only be viewed by its owner.";
    }
    if (isProtectedError) {
      return "This collection is protected and can only be viewed by the owner and invited users.";
    }
    return "You need to sign in to view this collection.";
  };

  const getRequestStatusMessage = () => {
    if (!requestStatus.hasRequest) return null;

    switch (requestStatus.status) {
      case "pending":
        return "You have already requested access to this collection. Please wait for the owner's response.";
      case "approved":
        return "Your access request has been approved! Please refresh the page to view the collection.";
      case "denied":
        return "Your previous access request was denied. You can request access again if needed.";
      default:
        return null;
    }
  };

  const getRequestButtonText = () => {
    if (requestStatus.hasRequest && requestStatus.status === "pending") {
      return "Request Pending";
    }
    if (requestStatus.hasRequest && requestStatus.status === "denied") {
      return "Request Again";
    }
    return "Request Access";
  };

  const shouldShowRequestButton = () => {
    if (isCheckingStatus) return false;
    if (!canShowRequestButton) return false;

    // Only check request status for signed-in users
    if (isSignedIn) {
      if (requestStatus.hasRequest && requestStatus.status === "pending")
        return false;
      if (requestStatus.hasRequest && requestStatus.status === "approved")
        return false;
    }

    return true;
  };

  const handleRequestSent = () => {
    // Refresh the request status
    setRequestStatus({
      hasRequest: true,
      status: "pending",
      requestedAt: new Date(),
    });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">{getIcon()}</div>
            <CardTitle className="text-xl">{getTitle()}</CardTitle>
            {finalCollectionTitle && (
              <CardDescription className="text-lg font-medium">
                &ldquo;{finalCollectionTitle}&rdquo;
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{getDescription()}</p>

            {/* Show access request status message */}
            {requestStatus.hasRequest && (
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground">
                  {getRequestStatusMessage()}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {/* Request Access Button */}
            {shouldShowRequestButton() && (
              <Button
                onClick={() => {
                  if (!isSignedIn) {
                    // Redirect non-signed-in users to sign up
                    window.location.href = "/sign-up";
                    return;
                  }
                  setIsRequestDialogOpen(true);
                }}
                className={`w-full ${
                  isSignedIn
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
                disabled={isCheckingStatus} // Only disable when checking status
              >
                <Send className="h-4 w-4 mr-2" />
                {isCheckingStatus
                  ? "Checking..."
                  : !isSignedIn
                    ? "Sign up to Request Access"
                    : getRequestButtonText()}
              </Button>
            )}

            {/* Show pending status as disabled button */}
            {requestStatus.hasRequest && requestStatus.status === "pending" && (
              <Button variant="outline" className="w-full" disabled>
                <Send className="h-4 w-4 mr-2" />
                Request Pending
              </Button>
            )}

            {/* Auth buttons for non-signed in users */}
            {!isSignedIn && !canShowRequestButton && (
              <>
                <Link href="/sign-in" className="w-full">
                  <Button className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="w-full">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </>
            )}

            <Link href="/" className="w-full">
              <Button variant="secondary" className="w-full">
                Go to Homepage
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Access Request Dialog */}
      {canShowRequestButton && collectionId && finalCollectionTitle && (
        <AccessRequestDialog
          isOpen={isRequestDialogOpen}
          onClose={() => setIsRequestDialogOpen(false)}
          collectionTitle={finalCollectionTitle}
          collectionId={collectionId}
          onRequestSent={handleRequestSent}
        />
      )}
    </>
  );
}
