import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { truncateText } from "@/lib/exploreUtils";

interface UserProfileSectionProps {
  userStats: {
    totalSavedCollections: number;
  };
  databaseUser: {
    id: string;
    name: string;
    email: string;
    username: string | null;
    totalCollections: number;
  } | null;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  userStats,
  databaseUser,
}) => {
  const { user, isLoaded } = useUser();

  // Show loading state while Clerk is determining authentication status
  if (!isLoaded) {
    return (
      <Card className="border border-border/50">
        <CardContent className="p-8 text-center">
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-6" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border border-border/50">
        <CardContent className="p-8 text-center">
          <Avatar className="h-24 w-24 mx-auto mb-6">
            <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
              ?
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-2">Welcome to Cur8t</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Discover amazing bookmark collections
          </p>

          <div className="space-y-3">
            <Link href="/sign-up">
              <Button className="w-full">Sign Up</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use database user info if available, fallback to Clerk user info
  const displayName =
    databaseUser?.name || user.firstName || user.username || "User";
  const profileUsername = databaseUser?.username;

  return (
    <Card className="border border-border/50">
      <CardContent className="p-8 text-center">
        {/* Make avatar and name clickable if user has username */}
        {profileUsername ? (
          <Link href={`/profile/${profileUsername}`} className="block group">
            <Avatar className="h-24 w-24 mx-auto mb-6 group-hover:ring-2 group-hover:ring-primary transition-all">
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {truncateText(displayName, 20)}
            </h2>
            <p className="text-muted-foreground text-sm mb-6 group-hover:text-primary/80 transition-colors">
              @{truncateText(profileUsername, 20)}
            </p>
          </Link>
        ) : (
          <>
            <Avatar className="h-24 w-24 mx-auto mb-6">
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-2">
              {truncateText(displayName, 20)}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Setup username in settings
            </p>
          </>
        )}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-muted-foreground">saved collections</span>
            <span className="text-primary font-medium">
              {userStats.totalSavedCollections}
            </span>
          </div>
          {databaseUser?.totalCollections !== undefined && (
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground">public collections</span>
              <span className="text-primary font-medium">
                {databaseUser.totalCollections}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
