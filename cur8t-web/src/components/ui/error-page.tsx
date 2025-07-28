import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Wifi,
  Server,
  Shield,
  Clock,
  Bug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export type ErrorType =
  | "rate-limit"
  | "network"
  | "server"
  | "permission"
  | "not-found"
  | "generic";

interface ErrorPageProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  errorCode?: string | number;
  retryAfter?: number;
  onRetry?: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const errorConfig = {
  "rate-limit": {
    icon: Clock,
    title: "Rate Limit Exceeded",
    description:
      "You've made too many requests. Please wait a moment before trying again.",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  network: {
    icon: Wifi,
    title: "Connection Error",
    description:
      "Unable to connect to the server. Please check your internet connection.",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  server: {
    icon: Server,
    title: "Server Error",
    description: "Something went wrong on our end. Our team has been notified.",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  permission: {
    icon: Shield,
    title: "Access Denied",
    description: "You don't have permission to access this resource.",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  "not-found": {
    icon: AlertTriangle,
    title: "Not Found",
    description: "The page or resource you're looking for doesn't exist.",
    color: "text-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
  generic: {
    icon: Bug,
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again.",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

export const ErrorPage: React.FC<ErrorPageProps> = ({
  type = "generic",
  title,
  description,
  errorCode,
  retryAfter,
  onRetry,
  onGoHome,
  showHomeButton = true,
  className = "",
  children,
}) => {
  const config = errorConfig[type];
  const Icon = config.icon;

  const formatRetryTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[400px] p-4 ${className}`}
    >
      <Card className={`w-full max-w-md ${config.borderColor}`}>
        <CardHeader className={`text-center ${config.bgColor}`}>
          <div
            className={`mx-auto mb-4 h-12 w-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm`}
          >
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <CardTitle className="text-xl font-semibold">
            {title || config.title}
          </CardTitle>
          {errorCode && (
            <Badge variant="outline" className="mx-auto">
              Error {errorCode}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {description || config.description}
          </p>

          {retryAfter && (
            <div
              className={`p-3 rounded-lg ${config.bgColor} ${config.borderColor} border`}
            >
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Try again in {formatRetryTime(retryAfter)}</span>
              </div>
            </div>
          )}

          {children}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {onRetry && (
              <Button onClick={onRetry} className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}

            {showHomeButton && (
              <Button
                variant="outline"
                onClick={onGoHome}
                className="w-full sm:w-auto"
                asChild={!onGoHome}
              >
                {onGoHome ? (
                  <>
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </>
                ) : (
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Specific error page components for common cases
export const RateLimitErrorPage: React.FC<Omit<ErrorPageProps, "type">> = (
  props
) => <ErrorPage type="rate-limit" {...props} />;

export const NetworkErrorPage: React.FC<Omit<ErrorPageProps, "type">> = (
  props
) => <ErrorPage type="network" {...props} />;

export const ServerErrorPage: React.FC<Omit<ErrorPageProps, "type">> = (
  props
) => <ErrorPage type="server" {...props} />;

export const NotFoundErrorPage: React.FC<Omit<ErrorPageProps, "type">> = (
  props
) => <ErrorPage type="not-found" {...props} />;

export const PermissionErrorPage: React.FC<Omit<ErrorPageProps, "type">> = (
  props
) => <ErrorPage type="permission" {...props} />;
