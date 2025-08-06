'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { PiX } from 'react-icons/pi';

import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen w-full max-w-md flex-col space-y-2 p-4',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-3 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-48 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-48',
  {
    variants: {
      variant: {
        default: 'bg-background/95 text-foreground border-border/50',
        success:
          'bg-primary/95 text-primary-foreground border-primary/50 shadow-primary/20',
        destructive:
          'bg-destructive/95 text-destructive-foreground border-destructive/50 shadow-destructive/20',
        warning:
          'bg-secondary/95 text-secondary-foreground border-secondary/50 shadow-secondary/20',
        info: 'bg-accent/95 text-accent-foreground border-accent/50 shadow-accent/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border/30 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.success]:border-primary-foreground/30 group-[.success]:hover:bg-primary-foreground/10 group-[.success]:focus:ring-primary-foreground group-[.destructive]:border-destructive-foreground/30 group-[.destructive]:hover:bg-destructive-foreground/10 group-[.destructive]:focus:ring-destructive-foreground group-[.warning]:border-secondary-foreground/30 group-[.warning]:hover:bg-secondary-foreground/10 group-[.warning]:focus:ring-secondary-foreground group-[.info]:border-accent-foreground/30 group-[.info]:hover:bg-accent-foreground/10 group-[.info]:focus:ring-accent-foreground',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-all duration-200 hover:text-foreground hover:bg-background/10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100 group-[.success]:text-primary-foreground/70 group-[.success]:hover:text-primary-foreground group-[.success]:hover:bg-primary-foreground/10 group-[.destructive]:text-destructive-foreground/70 group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:hover:bg-destructive-foreground/10 group-[.warning]:text-secondary-foreground/70 group-[.warning]:hover:text-secondary-foreground group-[.warning]:hover:bg-secondary-foreground/10 group-[.info]:text-accent-foreground/70 group-[.info]:hover:text-accent-foreground group-[.info]:hover:bg-accent-foreground/10',
      className
    )}
    toast-close=""
    {...props}
  >
    <PiX className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      'text-sm font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90 leading-relaxed', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
