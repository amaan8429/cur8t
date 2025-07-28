"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UsernamePage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const generateRandomUsername = () => {
    const adjectives = [
      "clever",
      "bright",
      "quick",
      "smart",
      "cool",
      "super",
      "amazing",
      "awesome",
    ];
    const nouns = [
      "user",
      "person",
      "maker",
      "builder",
      "creator",
      "explorer",
      "wizard",
      "ninja",
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 999);
    return `${adjective}${noun}${number}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate username
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters long");
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
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
          message: "Too many username change attempts. Please try again later.",
        });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set username");
      }

      router.push("/dashboard?item=Home");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create Your Username</CardTitle>
          <CardDescription>
            Choose a unique username that will be used for your shareable
            profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-1"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Setting Username..." : "Continue"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setUsername(generateRandomUsername())}
              >
                Generate Random Username
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
