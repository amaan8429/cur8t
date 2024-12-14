"use client";

import {
  // ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { getCollections } from "@/actions/getCollections";
import { useEffect, useState } from "react";
import { listenEvent } from "@/hooks/add-collection-event";

interface NavCollectionProps {
  activeCollectionId?: string;
}

interface Collection {
  id: string;
  name: string;
  userId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export function NavCollection({ activeCollectionId }: NavCollectionProps) {
  const { isMobile } = useSidebar();

  const [collections, setCollections] = useState<Collection[] | null>(null);

  //mounting useEffect
  useEffect(() => {
    async function fetchCollections() {
      const data = await getCollections();
      console.log(data);
      if ("error" in data) {
        console.error(data.error);
        setCollections([]);
      } else {
        setCollections(data.data);
      }
    }
    fetchCollections();
  }, []);

  //listen for collection creation
  useEffect(() => {
    const cleanup = listenEvent<Collection>(
      "collectionAdded",
      (newCollection) => {
        setCollections((prev) => [...(prev || []), newCollection]);
      }
    );

    return cleanup; // Cleanup listener on unmount
  }, []);

  if (!collections) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal />
              <span>Loading...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarMenu>
        {collections.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              isActive={item.id === activeCollectionId}
            >
              <Link
                href={`?collection=${encodeURIComponent(item.id)}`}
                title={item.name}
              >
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <StarOff className="text-muted-foreground" />
                  <span>Send to Trash</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LinkIcon className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
