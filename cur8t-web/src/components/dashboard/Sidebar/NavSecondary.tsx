import React from 'react';
import { IconType } from 'react-icons';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useActiveState } from '@/store/activeStateStore';

interface NavSecondaryProps {
  items: {
    title: string;
    icon: IconType;
    badge?: React.ReactNode;
  }[];
}

export function NavSecondary({
  items,
  ...props
}: NavSecondaryProps & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { activeSecondary } = useActiveState();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.title === activeSecondary}
              >
                <Link href={`?secondary=${encodeURIComponent(item.title)}`}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
