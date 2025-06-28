/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { Copy, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CreateApiKey,
  DeleteApiKey,
  GetAPIKeys,
} from "@/actions/collection/apikey";
import { useToast } from "@/hooks/use-toast";

const APIKeySettings = () => {
  const [apiKeys, setApiKeys] = useState<
    { name: string; key: string; createdAt: string }[]
  >([]);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedKeyForDeletion, setSelectedKeyForDeletion] = useState<{
    key: string;
    name: string;
  } | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKeys = async () => {
      const response = await GetAPIKeys();
      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to fetch API keys. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      if (response.data) {
        setApiKeys(
          response.data.map((key) => ({
            name: key.name,
            key: key.key,
            createdAt: key.createdAt.toISOString(),
          }))
        );
      }
    };

    fetchKeys();
  }, [toast]);

  const confirmDelete = (key: string, name: string) => {
    setSelectedKeyForDeletion({ key, name });
    setShowDeleteDialog(true);
  };

  const deleteKey = async () => {
    if (!selectedKeyForDeletion) return;

    setIsDeleting(true);
    const loadingToast = toast({
      title: "Deleting API key...",
      description: "Please wait while we delete your API key.",
    });

    const response = await DeleteApiKey(selectedKeyForDeletion.key);

    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      setApiKeys(apiKeys.filter((k) => k.key !== selectedKeyForDeletion.key));
      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
    }

    setIsDeleting(false);
    setShowDeleteDialog(false);
    setSelectedKeyForDeletion(null);
  };

  const handleCreateKey = async () => {
    setIsLoading(true);
    const loadingToast = toast({
      title: "Generating API key...",
      description: "Please wait while we generate your new API key.",
    });

    const data = await CreateApiKey(newKeyName);

    if (data.error || !data.data?.key) {
      toast({
        title: "Error",
        description: data.error || "Failed to create API key",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (apiKeys.length >= 3) {
      toast({
        title: "Error",
        description: "Maximum number of API keys reached",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setApiKeys([
      ...apiKeys,
      {
        name: data.data.name,
        key: data.data.key,
        createdAt: data.data.createdAt.toISOString(),
      },
    ]);

    toast({
      title: "Success",
      description: "New API key generated successfully",
    });

    setIsLoading(false);
    setNewKeyName("");
    setShowNewKeyDialog(false);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: `API key "${keyName}" copied to clipboard`,
        });
      },
      () => {
        toast({
          title: "Error",
          description: "Failed to copy API key to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for cli and other integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            You can generate up to 3 API keys
          </p>
          <Button
            onClick={() => setShowNewKeyDialog(true)}
            disabled={apiKeys.length >= 3 || isLoading}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate New Key
          </Button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{apiKey.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created on {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(apiKey.key, apiKey.name)}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="font-mono text-sm bg-muted p-2 rounded">
                {apiKey.key}
              </div>
            </div>
          ))}
        </div>

        {/* Generate New Key Dialog */}
        <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Development Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewKeyDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateKey}
                disabled={!newKeyName || isLoading}
              >
                {isLoading ? "Generating..." : "Generate Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete API Key</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the API key "
                {selectedKeyForDeletion?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteKey}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default APIKeySettings;
