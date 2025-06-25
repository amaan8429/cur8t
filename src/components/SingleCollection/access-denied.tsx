import React from "react";
import { Lock, Shield, LogIn } from "lucide-react";
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

interface AccessDeniedProps {
  error: string;
  collectionTitle?: string;
}

export function AccessDenied({ error, collectionTitle }: AccessDeniedProps) {
  const { isSignedIn } = useAuth();

  // Determine the type of error and appropriate icon/action
  const isPrivateError = error.includes("private");
  const isProtectedError = error.includes("protected");
  const needsAuth = error.includes("sign in");

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

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">{getIcon()}</div>
          <CardTitle className="text-xl">{getTitle()}</CardTitle>
          {collectionTitle && (
            <CardDescription className="text-lg font-medium">
              &ldquo;{collectionTitle}&rdquo;
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">{getDescription()}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {!isSignedIn && (
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
  );
}
