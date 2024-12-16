"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface LogoNameDisplayProps {
  name: string;
  Logo: React.ElementType;
}

export function LogoNameDisplay({ name, Logo }: LogoNameDisplayProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="w-full px-2">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Logo className="size-3" />
            </div>
            <span className="truncate font-semibold">{name}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
