import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Github, Code, Terminal, Chrome } from "lucide-react";
import React from "react";
import GitHubIntegrationComponent from "./GitHubIntegration";

const IntegrationsPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your favorite tools and enhance your workflow
        </p>
      </div>

      {/* GitHub Section */}
      <GitHubIntegrationComponent />

      {/* VS Code Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Code className="h-6 w-6" />
            <div>
              <CardTitle>VS Code Extension</CardTitle>
              <CardDescription>
                Extension to add your VS Code extensions directly as a
                collection.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Quick access
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Code snippets
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Extension management
              </li>
            </ul>
            <Button className="w-full">Install Extension</Button>
          </div>
        </CardContent>
      </Card>

      {/* CLI Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Terminal className="h-6 w-6" />
            <div>
              <CardTitle>CLI Tool</CardTitle>
              <CardDescription>
                Use the CLI tool to interact with your collections using the
                terminal.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Command-line access
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Batch operations
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Automation support
              </li>
            </ul>
            <Button className="w-full">Download CLI</Button>
          </div>
        </CardContent>
      </Card>

      {/* Browser Extension Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Chrome className="h-6 w-6" />
            <div>
              <CardTitle>Browser Extension</CardTitle>
              <CardDescription>
                Add links to your collections directly from your browser.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                One-click saving
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Quick access
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Web clipper
              </li>
            </ul>
            <Button className="w-full">Add to Browser</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsPage;
