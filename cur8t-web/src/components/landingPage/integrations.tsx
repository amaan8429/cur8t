"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Chrome,
  Code,
  Github,
  Globe,
  Smartphone,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface BentoGridItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
  status?: "available" | "coming-soon" | "beta";
  onClick?: () => void;
}

const BentoGridItem = ({
  title,
  description,
  icon,
  className,
  size = "small",
  status = "available",
  onClick,
}: BentoGridItemProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25 } },
  };

  const statusColors = {
    available: "bg-primary/10 text-primary",
    "coming-soon": "bg-muted/10 text-muted-foreground",
    beta: "bg-accent/10 text-accent-foreground",
  };

  const statusLabels = {
    available: "Available",
    "coming-soon": "Coming Soon",
    beta: "Beta",
  };

  return (
    <motion.div
      variants={variants}
      onClick={onClick}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-border bg-card px-6 pb-10 pt-6 shadow-sm transition-all duration-500 hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      <div className="absolute -right-1/2 top-0 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

      <div className="absolute bottom-3 right-1 scale-[6] text-primary/5 transition-all duration-700 group-hover:scale-[6.2] group-hover:text-primary/10">
        {icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm transition-all duration-500 group-hover:bg-primary/20">
              {icon}
            </div>
            <div
              className={cn(
                "rounded-full px-2 py-1 text-xs font-medium",
                statusColors[status]
              )}
            >
              {statusLabels[status]}
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-card-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="mt-4 flex items-center text-sm text-primary">
          <span className="mr-1">
            {status === "available"
              ? "Learn more"
              : status === "beta"
                ? "Try beta"
                : "Learn more"}
          </span>
          <ArrowRight className="size-4 transition-all duration-500 group-hover:translate-x-2" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-accent blur-2xl transition-all duration-500 group-hover:blur-lg" />
    </motion.div>
  );
};

const integrations = [
  {
    title: "Browser Extension",
    description: "Save bookmarks directly from your browser.",
    icon: <Chrome className="size-6" />,
    size: "large" as const,
    status: "available" as const,
  },
  {
    title: "Web Application",
    description: "Full-featured web app for managing collections.",
    icon: <Globe className="size-6" />,
    size: "large" as const,
    status: "available" as const,
  },
  {
    title: "VS Code Extension",
    description: "Curate code snippets from your editor.",
    icon: <Code className="size-6" />,
    size: "medium" as const,
    status: "coming-soon" as const,
  },
  {
    title: "GitHub Integration",
    description: "Sync starred repositories.",
    icon: <Github className="size-6" />,
    size: "medium" as const,
    status: "available" as const,
  },
  {
    title: "Mobile App",
    description: "Access content on mobile.",
    icon: <Smartphone className="size-6" />,
    size: "medium" as const,
    status: "coming-soon" as const,
  },
  {
    title: "CLI Tool",
    description: "Command-line interface for power users.",
    icon: <Terminal className="size-6" />,
    size: "medium" as const,
    status: "coming-soon" as const,
  },
];

export default function Integrations() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const handleBrowserExtensionClick = () => {
    document.getElementById("browser-extension-showcase")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Available Everywhere
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-xl text-muted-foreground"
          >
            Access your curated content across all your favorite platforms.
          </motion.p>
        </div>

        {/* Integrations Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {integrations.map((integration, i) => (
            <BentoGridItem
              key={i}
              title={integration.title}
              description={integration.description}
              icon={integration.icon}
              size={integration.size}
              status={integration.status}
              onClick={
                integration.title === "Browser Extension"
                  ? handleBrowserExtensionClick
                  : undefined
              }
              className={cn(
                integration.size === "large" && "sm:col-span-2",
                "min-h-[180px]"
              )}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
