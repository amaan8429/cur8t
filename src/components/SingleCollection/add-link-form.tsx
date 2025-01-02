"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FrontendLinkSchema, FrontendLink } from "@/types/types";

interface AddLinkFormProps {
  onLinkAdded: (link: { id: string; title: string; url: string }) => void;
}

export function AddLinkForm({ onLinkAdded }: AddLinkFormProps) {
  const form = useForm<FrontendLink>({
    resolver: zodResolver(FrontendLinkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  function onSubmit(values: FrontendLink) {
    onLinkAdded({
      id: Math.random().toString(36).slice(2, 9),
      ...values,
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter link title" {...field} />
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
          disabled={
            !form.formState.isValid ||
            form.formState.isSubmitting ||
            form.formState.isSubmitted
          }
        >
          Add Link
        </Button>
      </form>
    </Form>
  );
}
