import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  view: "grid" | "table";
  setView: (view: "grid" | "table") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ManageLinksHeader = ({
  view,
  setView,
  searchQuery,
  setSearchQuery,
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

        {/* Filters Button */}
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
};

export default ManageLinksHeader;
