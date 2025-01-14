import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PlusCircle, LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddLinkForm } from "./add-link-form";

interface HeaderProps {
  view: "grid" | "table";
  setView: (view: "grid" | "table") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLinkAdded: (link: { id: string; title: string; url: string }) => void;
}

const ManageLinksHeader = ({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  isOpen,
  setIsOpen,
  onLinkAdded,
}: HeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search and View Toggle Group */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView("grid")}
              disabled={view === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView("table")}
              disabled={view === "table"}
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Add New Link Button */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Link</DialogTitle>
            </DialogHeader>
            <AddLinkForm onLinkAdded={onLinkAdded} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageLinksHeader;
