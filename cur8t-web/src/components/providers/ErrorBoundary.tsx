"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorPage } from "@/components/ui/error-page";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to monitoring service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({ errorInfo });

    // Call the optional error handler
    this.props.onError?.(error, errorInfo);

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Determine error type based on error message
      let errorType: "network" | "server" | "generic" = "generic";
      let errorCode: string | undefined;

      if (this.state.error?.message.includes("fetch")) {
        errorType = "network";
      } else if (this.state.error?.message.includes("500")) {
        errorType = "server";
        errorCode = "500";
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <ErrorPage
            type={errorType}
            title="Unexpected Error"
            description={
              process.env.NODE_ENV === "development" 
                ? this.state.error?.message 
                : "Something unexpected happened. Please try refreshing the page."
            }
            errorCode={errorCode}
            onRetry={this.handleRetry}
            onGoHome={this.handleGoHome}
          >
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <details className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-left">
                <summary className="cursor-pointer text-sm font-medium">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-auto max-h-40">
                  {this.state.error?.stack}
                  {"\n\n"}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </ErrorPage>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}; 