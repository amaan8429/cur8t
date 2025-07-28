# Error Handling Guide

This guide explains how to use the custom error handling components throughout the Cur8t application.

## Components Overview

### 1. **Rate Limit Toast** (`/components/ui/rate-limit-toast.tsx`)

Custom toast notifications specifically for rate limiting scenarios.

```typescript
import { showRateLimitToast } from "@/components/ui/rate-limit-toast";

// Basic usage
showRateLimitToast({
  retryAfter: 60,
  message: "Too many requests. Please wait before trying again."
});

// With countdown (updates in real-time)
showRateLimitToastWithCountdown({
  retryAfter: 120,
  message: "API rate limit exceeded."
});
```

### 2. **Error Page Component** (`/components/ui/error-page.tsx`)

Reusable error page component for different types of errors.

```typescript
import { ErrorPage, RateLimitErrorPage, NetworkErrorPage } from "@/components/ui/error-page";

// Generic error page
<ErrorPage
  type="generic"
  title="Something went wrong"
  description="Please try again later"
  onRetry={() => window.location.reload()}
/>

// Specific error types
<RateLimitErrorPage 
  retryAfter={60}
  onRetry={handleRetry}
/>

<NetworkErrorPage 
  onRetry={handleRetry}
  onGoHome={() => router.push("/")}
/>
```

#### Available Error Types:
- `rate-limit` - For rate limiting scenarios
- `network` - For connection issues  
- `server` - For server-side errors
- `permission` - For access denied scenarios
- `not-found` - For 404 scenarios
- `generic` - Default fallback

### 3. **Error Boundary** (`/components/providers/ErrorBoundary.tsx`)

Catches unexpected JavaScript errors throughout the app.

```typescript
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";

// Wrap components that might throw errors
<ErrorBoundary onError={(error, errorInfo) => logError(error)}>
  <SomeComponent />
</ErrorBoundary>

// Hook version for functional components
import { useErrorBoundary } from "@/components/providers/ErrorBoundary";

function MyComponent() {
  const { captureError, resetError } = useErrorBoundary();
  
  const handleAsyncError = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      captureError(error);
    }
  };
}
```

## Implementation Patterns

### 1. **API Rate Limiting**

When your server actions return rate limit errors:

```typescript
// In your React Query hook
const { data, error } = useQuery({
  queryKey: ["data"],
  queryFn: async () => {
    const response = await fetchData();
    
    if ("error" in response && response.error) {
      if (response.error.includes("Too many requests")) {
        showRateLimitToast({
          retryAfter: response.retryAfter,
          message: "Data temporarily unavailable due to rate limiting.",
        });
        // Return empty data instead of throwing
        return { data: [] };
      }
      
      // For other errors, show regular toast
      toast({
        title: "Failed to load data",
        description: response.error,
        variant: "destructive",
      });
      return { data: [] };
    }
    
    return response;
  },
  retry: (failureCount, error) => {
    // Don't retry rate limit errors
    if (error?.message?.includes("Too many requests")) {
      return false;
    }
    return failureCount < 2;
  },
});
```

### 2. **Page-Level Error Handling**

For full-page errors, use the error page component:

```typescript
// For specific error scenarios
if (isRateLimited) {
  return (
    <RateLimitErrorPage
      retryAfter={retryAfter}
      onRetry={refetch}
      title="Collections Unavailable"
      description="Too many requests. Collections are temporarily unavailable."
    />
  );
}

if (isNetworkError) {
  return (
    <NetworkErrorPage
      onRetry={refetch}
      onGoHome={() => router.push("/")}
    />
  );
}
```

### 3. **Component-Level Error Handling**

For smaller components that might fail:

```typescript
function DataComponent() {
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <ErrorPage
        type="generic"
        title="Failed to load"
        description="This component couldn't load properly"
        onRetry={() => setError(null)}
        showHomeButton={false}
        className="h-64" // Smaller for component-level errors
      />
    );
  }
  
  // Normal component render...
}
```

## Usage Examples

### Example 1: Handle Different Server Responses

```typescript
// Server action returns different response shapes
async function handleApiCall() {
  const response = await serverAction();
  
  if ("error" in response) {
    if (response.error.includes("Rate limit")) {
      showRateLimitToast({ retryAfter: response.retryAfter });
      return;
    }
    
    if (response.error.includes("Network")) {
      // Show network error page
      setErrorType("network");
      return;
    }
    
    // Generic error toast
    toast({
      title: "Error",
      description: response.error,
      variant: "destructive",
    });
    return;
  }
  
  // Handle successful response
  setData(response.data);
}
```

### Example 2: Progressive Error Handling

```typescript
function useDataWithFallback() {
  const [fallbackMode, setFallbackMode] = useState(false);
  
  const { data, error } = useQuery({
    queryKey: ["data", fallbackMode],
    queryFn: async () => {
      if (fallbackMode) {
        // Use cached/offline data
        return getCachedData();
      }
      
      const response = await fetchLiveData();
      if ("error" in response) {
        if (response.error.includes("Rate limit")) {
          showRateLimitToast({ retryAfter: response.retryAfter });
          setFallbackMode(true); // Switch to fallback mode
          return getCachedData();
        }
        throw new Error(response.error);
      }
      
      return response;
    },
  });
  
  return { data, error, fallbackMode };
}
```

## Best Practices

1. **Use Toast for Rate Limits**: Never throw errors for rate limits, always use toast notifications
2. **Graceful Degradation**: Return empty data instead of breaking the UI
3. **Appropriate Error Types**: Use specific error types for better user experience
4. **Development vs Production**: Show detailed errors in development, user-friendly messages in production
5. **Error Boundaries**: Wrap risky components with error boundaries
6. **Retry Logic**: Implement smart retry logic that respects rate limits
7. **User Feedback**: Always provide clear feedback about what went wrong and what users can do

## Integration with Monitoring

```typescript
// In ErrorBoundary or error handlers
const logError = (error: Error, context?: any) => {
  // Log to your monitoring service
  console.error("Error:", error, context);
  
  // Example: Send to monitoring service
  // errorReportingService.captureException(error, context);
};
```

This error handling system provides a consistent, user-friendly way to handle all types of errors throughout your application while respecting rate limits and providing appropriate feedback to users. 