'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FrontendLinkSchema, FrontendLink } from '@/types/types';

interface AddLinkFormProps {
  onLinkAdded: (link: { id: string; title: string; url: string }) => void;
}

export function AddLinkForm({ onLinkAdded }: AddLinkFormProps) {
  const form = useForm<FrontendLink>({
    resolver: zodResolver(FrontendLinkSchema),
    defaultValues: {
      title: '',
      url: '',
    },
  });

  function onSubmit(values: FrontendLink) {
    // Pass title as-is (empty string if not provided) - backend will handle auto-generation
    onLinkAdded({
      id: Math.random().toString(36).slice(2, 9),
      title: values.title?.trim() || '',
      url: values.url,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Leave empty to auto-generate from URL"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.watch('url')?.trim()}
        >
          Add Link
        </Button>
      </form>
    </Form>
  );
}
