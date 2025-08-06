"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import {
  PiBookmark,
  PiGlobe,
  PiShare,
  PiShield,
  PiSparkle,
  PiMagnifyingGlass,
  PiBrowser,
  PiPhone,
} from "react-icons/pi";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items?: BentoItem[];
}

const itemsSample: BentoItem[] = [
  {
    title: "Smart Collections",
    meta: "AI-Powered",
    description:
      "Organize your bookmarks into intelligent collections with automatic categorization and tagging. Never lose track of important content again.",
    icon: <PiBookmark className="text-primary h-4 w-4" />,
    status: "Popular",
    tags: ["AI", "Organization", "Smart"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Browser Extension",
    meta: "Chrome & Firefox",
    description:
      "Save any webpage instantly with our seamless browser extension. One-click bookmarking with automatic metadata extraction.",
    icon: <PiBrowser className="text-primary h-4 w-4" />,
    status: "Essential",
    tags: ["Extension", "Chrome"],
  },
  {
    title: "Universal Access",
    description:
      "Access your bookmarks from any device, anywhere. Seamless sync across desktop, mobile, and web platforms.",
    icon: <PiGlobe className="text-primary h-4 w-4" />,
    status: "Sync",
  },
  {
    title: "Mobile Apps",
    description:
      "Native mobile apps for iOS and Android. Save and access your bookmarks on the go with offline support.",
    icon: <PiPhone className="text-primary h-4 w-4" />,
    meta: "iOS & Android",
    tags: ["Mobile", "Offline"],
  },
  {
    title: "Advanced Search",
    description:
      "Find any bookmark instantly with powerful search capabilities. Search by title, content, tags, or even within saved pages.",
    icon: <PiMagnifyingGlass className="text-primary h-4 w-4" />,
    meta: "Full-text",
    tags: ["Search", "Fast"],
  },
  {
    title: "Social Sharing",
    meta: "Public Collections",
    description:
      "Share your curated collections with the world. Discover amazing bookmarks from other users and build your network.",
    icon: <PiShare className="text-primary h-4 w-4" />,
    status: "Community",
    tags: ["Sharing", "Social"],
  },
  {
    title: "Privacy & Security",
    meta: "End-to-End",
    description:
      "Your bookmarks are encrypted and secure. Private collections stay private, with enterprise-grade security and data protection.",
    icon: <PiShield className="text-primary h-4 w-4" />,
    status: "Secure",
    tags: ["Privacy", "Encryption"],
    colSpan: 2,
  },
];

export default function Integrations({ items = itemsSample }: BentoGridProps) {
  return (
    <section className="relative overflow-hidden py-16">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 text-center mb-12">
        <Badge
          variant="outline"
          className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
        >
          <PiSparkle className="text-primary mr-1 h-3.5 w-3.5" />
          Features
        </Badge>
        <motion.h2
          className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Everything you need to organize the web
        </motion.h2>
        <motion.p
          className="text-muted-foreground mx-auto max-w-md pt-2 text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Powerful tools to save, organize, and discover your favorite content
          from anywhere on the web.
        </motion.p>
      </div>

      {/* Decorative elements */}
      <div className="bg-primary/5 absolute top-20 -left-20 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-primary/5 absolute -right-20 bottom-20 h-64 w-64 rounded-full blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={`${item.title}-${item.status || item.meta}`}
            className={cn(
              item.colSpan || "col-span-1",
              item.colSpan === 2 ? "md:col-span-2" : ""
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "group bg-card/40 relative h-full transition-all duration-300 hover:shadow-md",
                "will-change-transform hover:-translate-y-1",
                "border-border/60 overflow-hidden",
                {
                  "-translate-y-1 shadow-md": item.hasPersistentHover,
                }
              )}
            >
              <div
                className={cn(
                  "absolute inset-0",
                  item.hasPersistentHover
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                  "transition-opacity duration-300"
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:4px_4px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
              </div>

              <CardHeader className="relative space-y-0 p-4">
                <div className="flex items-center justify-between">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    {item.icon}
                  </div>
                  <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs font-medium">
                    {item.status || "Active"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-2 p-4 pt-0">
                <h3 className="text-foreground text-[15px] font-medium tracking-tight">
                  {item.title}
                  {item.meta && (
                    <span className="text-muted-foreground ml-2 text-xs font-normal">
                      {item.meta}
                    </span>
                  )}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>

              <CardFooter className="relative p-4">
                <div className="flex w-full items-center justify-between">
                  <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                    {item.tags?.map((tag) => (
                      <span
                        key={`${item.title}-${tag}`}
                        className="bg-secondary/50 rounded-md px-2 py-1 backdrop-blur-xs transition-all duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-primary text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                    {item.cta || "Learn More →"}
                  </span>
                </div>
              </CardFooter>

              <div
                className={cn(
                  "via-primary/10 absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-transparent to-transparent p-px",
                  item.hasPersistentHover
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                  "transition-opacity duration-300"
                )}
              />
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
