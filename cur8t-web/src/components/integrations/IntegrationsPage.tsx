import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Code,
  Terminal,
  Chrome,
  ExternalLink,
  Download,
  Zap,
  Clock,
} from "lucide-react";
import React from "react";
import GitHubIntegrationComponent from "./GitHubIntegration";

const IntegrationsPage = () => {
  const handleChromeExtensionClick = () => {
    window.open(
      "https://chrome.google.com/webstore/detail/cur8t/YOUR_ACTUAL_EXTENSION_ID_HERE",
      "_blank"
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* GitHub Integration - Enhanced */}
      <GitHubIntegrationComponent />

      {/* VS Code Extension */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>VS Code Extension</CardTitle>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    Coming Soon
                  </Badge>
                </div>
                <CardDescription>
                  Manage your VS Code extensions as collections
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Zap className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-medium">Quick Access</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Code className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-medium">Snippets</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Download className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-medium">Auto-Install</div>
              </div>
            </div>
            <Button className="w-full" disabled>
              <Code className="mr-2 h-4 w-4" />
              Available Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CLI Tool */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Terminal className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>CLI Tool</CardTitle>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    Coming Soon
                  </Badge>
                </div>
                <CardDescription>
                  Command-line interface for power users
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Terminal className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium">Scripts</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Zap className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium">Batch Ops</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Code className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium">Automation</div>
              </div>
            </div>
            <Button className="w-full" disabled>
              <Terminal className="mr-2 h-4 w-4" />
              Available Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Browser Extension */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Chrome className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Browser Extension</CardTitle>
                  <Badge
                    variant="default"
                    className="bg-green-500/10 text-green-700 border-green-200"
                  >
                    Available
                  </Badge>
                </div>
                <CardDescription>
                  Save links directly from any webpage
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Zap className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <div className="text-sm font-medium">One-Click</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Code className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <div className="text-sm font-medium">Web Clipper</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Chrome className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <div className="text-sm font-medium">Quick Access</div>
              </div>
            </div>
            <Button className="w-full" onClick={handleChromeExtensionClick}>
              <Chrome className="mr-2 h-4 w-4" />
              Add to Chrome
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsPage;
