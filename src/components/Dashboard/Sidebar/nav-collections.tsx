"use client";

import { LinkIcon, MoreHorizontal } from "lucide-react";

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
import { DeleteCollection } from "@/actions/deleteCollection";
import ChangeVisiblity from "./change-visiblity";
import DeleteCollectionOption from "./delete-collection";
import { useCollectionEvent } from "@/hooks/collection-visiblity-chang-event";
import CopyCollectionLink from "./copy-collection-link";

interface NavCollectionProps {
  activeCollectionId?: string;
  onCollectionDelete?: (collectionId: string) => void;
}

interface Collection {
  id: string;
  name: string;
  userId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  visiblity: string;
}

export function NavCollection({
  activeCollectionId,
  onCollectionDelete,
}: NavCollectionProps) {
  const { isMobile } = useSidebar();

  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null
  );

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
    const cleanup = listenEvent(
      "collectionAdded",
      (newCollection: { detail: Collection }) => {
        setCollections((prev) => [...(prev || []), newCollection.detail]);
      }
    );

    return cleanup; // Cleanup listener on unmount
  }, []);

  useCollectionEvent("collectionUpdated", (event) => {
    const updatedCollection = event.detail;
    setCollections((prev) =>
      prev
        ? prev.map((collection) =>
            collection.id === updatedCollection.id
              ? { ...collection, ...updatedCollection }
              : collection
          )
        : []
    );
  });

  const handleDeleteCollection = async () => {
    if (!collectionToDelete) return;

    try {
      const result = await DeleteCollection(collectionToDelete);

      if ("error" in result) {
        // toast({
        //   title: "Error",
        //   description: result.error,
        //   variant: "destructive",
        // });
        alert(result.error);
        return;
      }

      // Remove the collection from the state
      setCollections((prev) =>
        prev
          ? prev.filter((collection) => collection.id !== collectionToDelete)
          : []
      );

      // Call the optional callback if provided
      onCollectionDelete?.(collectionToDelete);

      //

      alert("Collection deleted successfully");
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to delete collection",
      //   variant: "destructive",
      // });
      alert("Failed to delete collection");
    } finally {
      setCollectionToDelete(null);
    }
  };

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
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
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
                  <ChangeVisiblity
                    collectionId={collection.id}
                    collectionVisiblity={collection.visiblity}
                  />
                  <DropdownMenuSeparator />
                  <CopyCollectionLink collectionId={collection.id} />
                  <DropdownMenuSeparator />
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
