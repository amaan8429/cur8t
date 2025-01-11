"use client";

import * as React from "react";
import {
  // AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  // Inbox,
  MessageCircleQuestion,
  SunMoon,
  Search,
  Settings2,
  Workflow,
  // Sparkles,
  Trash2,
} from "lucide-react";

import { NavCollection } from "@/components/Dashboard/Sidebar/NavCollection/nav-collections";
import { NavMain } from "@/components/Dashboard/Sidebar/nav-main";
import { NavSecondary } from "@/components/Dashboard/Sidebar/nav-secondary";
import { LogoNameDisplay } from "@/components/Dashboard/Sidebar/logo-name-display";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "../../ui/separator";

// This is sample data.
const data = {
  LogoAndName: {
    name: "Bukmarks",
    logo: Command,
  },
  navMain: [
    {
      title: "Add Collection",
      url: "#",
      icon: Search,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Integrations",
      icon: Workflow,
    },
    {
      title: "Settings",
      icon: Settings2,
    },
    {
      title: "Trash",
      icon: Trash2,
    },
    {
      title: "Help",
      icon: MessageCircleQuestion,
    },
  ],
  lists: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      emoji: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      emoji: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      emoji: "🌱",
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      emoji: "🗣️",
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      emoji: "🏠",
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      emoji: "💰",
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      emoji: "🎬",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      emoji: "✅",
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeItem: string;
  activeCollectionId?: string;
  activeSecondary?: string;
}

export function AppSidebar({
  activeItem,
  activeCollectionId,
  activeSecondary,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <LogoNameDisplay
          Logo={data.LogoAndName.logo}
          name={data.LogoAndName.name}
        />
        <NavMain items={data.navMain} activeItem={activeItem} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavCollection activeCollectionId={activeCollectionId} />
        <Separator />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
          activeSecondary={activeSecondary}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
