import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollectionStore } from "@/store/collection-store";
import { useActiveState } from "@/store/activeStateStore";
import { useToast } from "@/hooks/use-toast";
import { getLinksAction } from "@/actions/linkActions/getLinks";

interface ExportActionProps {
  exportFormat: string;
  setExportFormat: (format: string) => void;
  isExporting: boolean;
  setIsExporting: (loading: boolean) => void;
  onClose: () => void;
}

export const ExportAction: React.FC<ExportActionProps> = ({
  exportFormat,
  setExportFormat,
  isExporting,
  setIsExporting,
  onClose,
}) => {
  const { collections } = useCollectionStore();
  const { activeCollectionId } = useActiveState();
  const { toast } = useToast();

  const getActiveCollection = () =>
    collections?.find((c) => c.id === activeCollectionId);

  const handleConfirm = async () => {
    if (!activeCollectionId) {
      toast({
        title: "No collection selected",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const active = getActiveCollection();
      if (!active) {
        toast({
          title: "Collection not found",
          variant: "destructive",
        });
        return;
      }

      // Get collection links
      const linksResult = await getLinksAction(activeCollectionId);
      if (!linksResult.success) {
        toast({
          title: "Failed to fetch collection data",
          variant: "destructive",
        });
        return;
      }

      const links = linksResult.data || [];
      const exportData = {
        collection: {
          id: active.id,
          title: active.title,
          description: active.description,
          author: active.author,
          visibility: active.visibility,
          createdAt: active.createdAt,
          totalLinks: links.length,
        },
        links: links.map((link) => ({
          title: link.title,
          url: link.url,
          createdAt: link.createdAt,
        })),
        exportedAt: new Date().toISOString(),
      };

      let fileContent: string;
      let fileName: string;
      let mimeType: string;

      switch (exportFormat) {
        case "json":
          fileContent = JSON.stringify(exportData, null, 2);
          fileName = `${active.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_collection.json`;
          mimeType = "application/json";
          break;
        case "csv":
          const csvHeader = "Title,URL,Created At\n";
          const csvRows = links
            .map(
              (link) =>
                `"${link.title.replace(/"/g, '""')}","${link.url}","${link.createdAt}"`
            )
            .join("\n");
          fileContent = csvHeader + csvRows;
          fileName = `${active.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_links.csv`;
          mimeType = "text/csv";
          break;
        case "txt":
          fileContent = `${active.title}\n${"=".repeat(active.title.length)}\n\n`;
          fileContent += `Description: ${active.description}\n`;
          fileContent += `Total Links: ${links.length}\n`;
          fileContent += `Created: ${active.createdAt}\n\n`;
          fileContent += "Links:\n";
          fileContent += links
            .map(
              (link, index) => `${index + 1}. ${link.title}\n   ${link.url}\n`
            )
            .join("\n");
          fileName = `${active.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_collection.txt`;
          mimeType = "text/plain";
          break;
        default:
          fileContent = JSON.stringify(exportData, null, 2);
          fileName = `${active.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_collection.json`;
          mimeType = "application/json";
      }

      // Create and download file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Collection exported successfully",
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred while exporting",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="py-4 space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="export-format" className="text-right">
            Format
          </Label>
          <Select
            value={exportFormat}
            onValueChange={setExportFormat}
            disabled={isExporting}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON (Complete Data)</SelectItem>
              <SelectItem value="csv">CSV (Links Only)</SelectItem>
              <SelectItem value="txt">Text (Human Readable)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={isExporting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={isExporting}>
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DialogFooter>
    </>
  );
};
