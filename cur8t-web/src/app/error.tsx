'use client';

import { ErrorPage } from '@/components/ui/error-page';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error);
  }, [error]);

  // Determine error type based on error message or other properties
  let errorType: 'network' | 'server' | 'generic' = 'generic';
  let errorCode: string | undefined;

  if (error.message.includes('fetch') || error.message.includes('network')) {
    errorType = 'network';
  } else if (error.message.includes('500') || error.digest) {
    errorType = 'server';
    errorCode = '500';
  }

  return (
    <div className="min-h-screen bg-background">
      <ErrorPage
        type={errorType}
        title="Something Went Wrong"
        description={
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'An unexpected error occurred. Please try again.'
        }
        errorCode={errorCode}
        onRetry={reset}
      >
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-left">
            <summary className="cursor-pointer text-sm font-medium">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}
      </ErrorPage>
    </div>
  );
}
