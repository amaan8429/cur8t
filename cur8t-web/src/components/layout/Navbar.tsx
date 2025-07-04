"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Github } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <span className="font-bold">Storer</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="h-9 w-9 p-0">
            <Github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Button>
          {!isDashboard && (
            <>
              {isSignedIn ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link
                      href="/add-extension"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === "/add-extension"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      Add Extension
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === "/dashboard"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">Sign up</Button>
                  </SignUpButton>
                </>
              )}
            </>
          )}
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>
    </header>
  );
}
