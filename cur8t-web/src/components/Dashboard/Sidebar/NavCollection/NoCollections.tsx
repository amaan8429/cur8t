import React from "react";
import { useRouter } from "next/navigation";
import { Folder, Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCollectionComponent } from "../../TopSection/CreateCollection";

const NoCollections = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const router = useRouter();

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-60 hover:opacity-100 transition-opacity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <CreateCollectionComponent
              onSuccess={(collectionId) => {
                setIsCreateDialogOpen(false);
                // Navigate to the new collection using Next.js router (no page reload)
                router.push(
                  `?collectionId=${encodeURIComponent(collectionId)}`
                );
              }}
              isDialog={true}
            />
          </DialogContent>
        </Dialog>
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <SidebarMenuButton className="text-sidebar-foreground/70 cursor-pointer hover:bg-sidebar-accent/50">
                <Folder className="h-4 w-4 mr-2" />
                <span>No collections yet - Click to create one</span>
              </SidebarMenuButton>
            </DialogTrigger>
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NoCollections;
