"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangeVisibility from "./change-visibility";
import CopyCollectionLink from "./copy-collection-link";
import DeleteCollectionOption from "./delete-collection";
import ChangeCollectionName from "./change-collection-name";
import { useCollectionStore } from "@/store/collection-store";

interface NavCollectionProps {
  activeCollectionId?: string;
}

export function NavCollection({ activeCollectionId }: NavCollectionProps) {
  const { isMobile } = useSidebar();
  const { collections, fetchCollections, deleteCollection } =
    useCollectionStore();
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null
  );

  // Fetch collections on mount
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleDeleteCollection = async () => {
    if (!collectionToDelete) return;

    await deleteCollection(collectionToDelete);
    setCollectionToDelete(null); // Reset state after deletion
  };

  if (!collections) {
    return (
      <SidebarGroup>
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
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
        <SidebarMenu>
          {collections.map((collection) => (
            <SidebarMenuItem key={collection.id}>
              <SidebarMenuButton
                asChild
                isActive={collection.id === activeCollectionId}
              >
                <Link
                  href={`?collectionId=${encodeURIComponent(collection.id)}`}
                  title={collection.name}
                >
                  <span>{collection.name}</span>
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
                  {/* Change visibility */}
                  <ChangeVisibility
                    collectionId={collection.id}
                    collectionVisibility={collection.visibility}
                  />
                  <DropdownMenuSeparator />
                  {/* Copy collection link */}
                  <CopyCollectionLink collectionId={collection.id} />
                  <DropdownMenuSeparator />
                  {/* Change collection name */}
                  <ChangeCollectionName
                    collectionId={collection.id}
                    collectionName={collection.name}
                  />
                  <DropdownMenuSeparator />
                  {/* Delete collection */}
                  <DeleteCollectionOption
                    collection={collection}
                    setCollectionToDelete={setCollectionToDelete}
                    handleDeleteCollection={handleDeleteCollection}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
