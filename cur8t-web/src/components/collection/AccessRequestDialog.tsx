"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { requestAccessAction } from "@/actions/collection/accessRequests";
import { PiPaperPlaneRight } from "react-icons/pi";

interface AccessRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collectionTitle: string;
  collectionId: string;
  onRequestSent?: () => void;
}

export function AccessRequestDialog({
  isOpen,
  onClose,
  collectionTitle,
  collectionId,
  onRequestSent,
}: AccessRequestDialogProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, success: toastSuccess, error: toastError } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const result = await requestAccessAction(collectionId, message.trim());

      // Check for rate limiting
      if (result.error && result.retryAfter) {
        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter: result.retryAfter * 60,
          message: "Too many access requests. Please try again later.",
        });
        setIsSubmitting(false);
        return;
      }

      if (result.success) {
        toastSuccess({
          title: "Request Sent!",
          description:
            "Your access request has been sent to the collection owner. You'll be notified when they respond.",
        });
        setMessage("");
        onClose();
        onRequestSent?.();
      } else {
        toastError({
          title: "Request Failed",
          description:
            result.error || "Failed to send access request. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending access request:", error);
      toastError({
        title: "Request Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiPaperPlaneRight className="h-5 w-5 text-primary" />
            Request Access
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-message" className="text-sm font-medium">
              Message (optional)
            </Label>
            <Textarea
              id="access-message"
              placeholder="Optionally explain why you'd like access to this collection..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <PiPaperPlaneRight className="h-4 w-4 mr-2 animate-pulse" />
                Sending...
              </>
            ) : (
              <>
                <PiPaperPlaneRight className="h-4 w-4 mr-2" />
                Send Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
