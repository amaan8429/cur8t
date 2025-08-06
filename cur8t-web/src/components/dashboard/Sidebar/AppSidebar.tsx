'use client';

import * as React from 'react';
import {
  // AudioWaveform,
  PiCommand,
  PiHouse,
  PiMagnifyingGlass,
  PiGear,
  PiChartLine,
  PiBookmark,
  PiCreditCard,
  PiBell,
  PiStar,
} from 'react-icons/pi';

import { NavCollection } from '@/components/dashboard/Sidebar/NavCollection/NavCollections';
import { NavMain } from '@/components/dashboard/Sidebar/NavMain';
import { NavSecondary } from '@/components/dashboard/Sidebar/NavSecondary';
import { LogoNameDisplay } from '@/components/dashboard/Sidebar/LogoNameDisplay';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Separator } from '../../ui/separator';

// This is sample data.
const data = {
  LogoAndName: {
    name: 'Bukmarks',
    logo: PiCommand,
  },
  navMain: [
    {
      title: 'Overview',
      url: '#',
      icon: PiHouse,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: 'Integrations',
      icon: PiChartLine,
    },
    {
      title: 'Notifications',
      icon: PiBell,
    },
    {
      title: 'Favorites',
      icon: PiStar,
    },
    {
      title: 'Manage Subscription',
      icon: PiCreditCard,
    },
    {
      title: 'Saved Collections',
      icon: PiBookmark,
    },
    {
      title: 'Tools and Agents',
      icon: PiCommand,
    },
    {
      title: 'Explore Collections',
      icon: PiMagnifyingGlass,
    },
    {
      title: 'Settings',
      icon: PiGear,
    },
  ],
  lists: [
    {
      name: 'Project Management & Task Tracking',
      url: '#',
      emoji: '📊',
    },
    {
      name: 'Family Recipe Collection & Meal Planning',
      url: '#',
      emoji: '🍳',
    },
    {
      name: 'Fitness Tracker & Workout Routines',
      url: '#',
      emoji: '💪',
    },
    {
      name: 'Book Notes & Reading List',
      url: '#',
      emoji: '📚',
    },
    {
      name: 'Sustainable Gardening Tips & Plant Care',
      url: '#',
      emoji: '🌱',
    },
    {
      name: 'Language Learning Progress & Resources',
      url: '#',
      emoji: '🗣️',
    },
    {
      name: 'Home Renovation Ideas & Budget Tracker',
      url: '#',
      emoji: '🏠',
    },
    {
      name: 'Personal Finance & Investment Portfolio',
      url: '#',
      emoji: '💰',
    },
    {
      name: 'Movie & TV Show Watchlist with Reviews',
      url: '#',
      emoji: '🎬',
    },
    {
      name: 'Daily Habit Tracker & Goal Setting',
      url: '#',
      emoji: '✅',
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <LogoNameDisplay
          Logo={data.LogoAndName.logo}
          name={data.LogoAndName.name}
        />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavCollection />
        <Separator />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
