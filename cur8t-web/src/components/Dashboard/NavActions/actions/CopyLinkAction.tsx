import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CopyLinkActionProps {
  copyLink: string;
  onClose: () => void;
}

export const CopyLinkAction: React.FC<CopyLinkActionProps> = ({
  copyLink,
  onClose,
}) => {
  const { toast, success: toastSuccess } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyLink);
    toastSuccess({
      title: "Link Copied!",
      description: "Collection link has been copied to clipboard.",
    });
  };

  return (
    <>
      <div className="py-4">
        <div className="flex space-x-2">
          <Input value={copyLink} readOnly className="flex-1" />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onClose}>Done</Button>
      </DialogFooter>
    </>
  );
};
