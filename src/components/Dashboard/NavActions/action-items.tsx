"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { actionsData as data } from "./actions-data";

const ActionItems = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 data-[state=open]:bg-accent"
        >
          <MoreHorizontal size={64} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 overflow-hidden rounded-lg p-0"
        align="end"
      >
        <Sidebar collapsible="none" className="bg-transparent">
          <SidebarContent>
            {data.map((group, index) => (
              <SidebarGroup key={index} className="border-b last:border-none">
                <SidebarGroupContent className="gap-0">
                  <SidebarMenu>
                    {group.map((item, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton
                          onClick={() => {
                            alert("You clicked " + item.label);
                          }}
                        >
                          <item.icon /> <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
      </PopoverContent>
    </Popover>
  );
};

export default ActionItems;
