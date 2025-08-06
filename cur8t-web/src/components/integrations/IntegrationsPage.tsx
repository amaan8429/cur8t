import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PiCode,
  PiTerminal,
  PiDownload,
  PiClock,
  PiLightning,
  PiBrowser,
  PiArrowSquareOut,
} from 'react-icons/pi';
import React from 'react';
import GitHubIntegrationComponent from './GitHubIntegration';

const IntegrationsPage = () => {
  const handleChromeExtensionClick = () => {
    window.open(
      'https://chrome.google.com/webstore/detail/cur8t/YOUR_ACTUAL_EXTENSION_ID_HERE',
      '_blank'
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
                <PiCode className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>VS Code Extension</CardTitle>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <PiClock className="h-3 w-3" />
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
                <PiLightning className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-medium">Quick Access</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <PiCode className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-medium">Snippets</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <PiDownload className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-medium">Auto-Install</div>
              </div>
            </div>
            <Button className="w-full" disabled>
              <PiCode className="mr-2 h-4 w-4" />
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
                <PiTerminal className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>CLI Tool</CardTitle>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <PiClock className="h-3 w-3" />
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
                <PiTerminal className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium">Scripts</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <PiLightning className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium">Batch Ops</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <PiCode className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium">Automation</div>
              </div>
            </div>
            <Button className="w-full" disabled>
              <PiTerminal className="mr-2 h-4 w-4" />
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
                <PiBrowser className="h-6 w-6 text-orange-600" />
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
                <PiLightning className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <div className="text-sm font-medium">One-Click</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <PiCode className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <div className="text-sm font-medium">Web Clipper</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <PiBrowser className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <div className="text-sm font-medium">Quick Access</div>
              </div>
            </div>
            <Button className="w-full" onClick={handleChromeExtensionClick}>
              <PiBrowser className="mr-2 h-4 w-4" />
              Add to Chrome
              <PiArrowSquareOut className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsPage;
