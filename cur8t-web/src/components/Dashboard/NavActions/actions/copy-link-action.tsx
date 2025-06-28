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
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(copyLink);
    toast({
      title: "Link copied to clipboard!",
    });
  };

  return (
    <>
      <div className="py-4">
        <div className="flex space-x-2">
          <Input value={copyLink} readOnly className="flex-1" />
          <Button onClick={handleCopyLink}>Copy</Button>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onClose}>Done</Button>
      </DialogFooter>
    </>
  );
};
