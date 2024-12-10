"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PlusCircle, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Link {
  id: string;
  title: string;
  url: string;
}

export default function CollectionPage() {
  const params = useParams();
  const [collectionName, setCollectionName] = useState("My Collection");
  const [links, setLinks] = useState<Link[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  useEffect(() => {
    // In a real application, you would fetch the collection data here
    console.log("Fetching collection data for ID:", params.id);
    // For now, we'll just set a dummy collection name
    setCollectionName(`Collection ${params.id}`);
  }, [params.id]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLinkTitle && newLinkUrl) {
      const newLink: Link = {
        id: Math.random().toString(36).substr(2, 9),
        title: newLinkTitle,
        url: newLinkUrl,
      };
      setLinks([...links, newLink]);
      setNewLinkTitle("");
      setNewLinkUrl("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{collectionName}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Link</CardTitle>
          <CardDescription>Add a new link to your collection</CardDescription>
        </CardHeader>
        <form onSubmit={handleAddLink}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-title">Link Title</Label>
              <Input
                id="link-title"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Enter link title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <Card key={link.id}>
            <CardHeader>
              <CardTitle className="text-lg">{link.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center"
              >
                {link.url}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
