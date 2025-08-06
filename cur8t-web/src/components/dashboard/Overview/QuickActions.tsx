'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconType } from 'react-icons';

interface QuickAction {
  title: string;
  description: string;
  icon: IconType;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const getActionVariant = (variant: QuickAction['variant'] = 'neutral') => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-primary-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'accent':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start h-auto p-4"
            onClick={action.action}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${getActionVariant(
                action.variant
              )}`}
            >
              <action.icon className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-sm text-muted-foreground">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
