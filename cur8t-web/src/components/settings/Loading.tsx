import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const LoadingSettings = () => {
  return (
    <div className="mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-6">
            <div className="h-24 w-24 rounded-full bg-muted" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingSettings;
