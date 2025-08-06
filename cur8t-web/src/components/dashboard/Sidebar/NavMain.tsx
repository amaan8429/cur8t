"use client";

import { IconType } from "react-icons";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useActiveState } from "@/store/activeStateStore";
import Link from "next/link";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: IconType;
    isActive?: boolean;
  }[];
}

export function NavMain({ items }: NavMainProps) {
  const { activeItem } = useActiveState();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.title === activeItem}>
            <Link href={`?item=${encodeURIComponent(item.title)}`}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
