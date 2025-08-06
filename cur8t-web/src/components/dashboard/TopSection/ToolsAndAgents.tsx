'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PiFileText,
  PiDownload,
  PiSparkle,
  PiPlayCircle,
  PiUpload,
  PiArrowSquareOut,
  PiYoutubeLogo,
  PiRobot,
} from 'react-icons/pi';
import { ArticleExtractorDialog } from './dialogs/ArticleExtractorDialog';
import { BookmarkImporterDialog } from './dialogs/BookmarkImporterDialog';
import { ApiStatusIndicator } from './dialogs/ApiStatusIndicator';

const agents = [
  {
    id: 1,
    title: 'Article Link Extractor',
    description: 'Extract all links from any article and create a collection',
    icon: PiFileText,
    status: 'Active',
    features: ['Smart detection', 'Auto collections', 'Content analysis'],
  },
  {
    id: 6,
    title: 'Bookmark File Importer',
    description: 'Import bookmarks and sort them into organized collections',
    icon: PiUpload,
    status: 'Active',
    features: ['Multiple browsers', 'AI categorization', 'Smart sorting'],
  },
  {
    id: 2,
    title: 'Smart Export Guide',
    description: 'Export collections as formatted guides with descriptions',
    icon: PiDownload,
    status: 'Coming Soon',
    features: ['Custom formatting', 'Templates', 'Multiple formats'],
  },
  {
    id: 3,
    title: 'Collection Generator',
    description: 'AI-powered collection creation based on topics and interests',
    icon: PiSparkle,
    status: 'Coming Soon',
    features: ['Topic-based', 'Interest matching', 'Auto categorization'],
  },
  {
    id: 4,
    title: 'YouTube Link Extractor',
    description: 'Extract links from YouTube video descriptions and comments',
    icon: PiYoutubeLogo,
    status: 'Coming Soon',
    features: ['Description parsing', 'Comment scanning', 'Timestamps'],
  },
  {
    id: 5,
    title: 'Watch Later Organizer',
    description: 'Sort Watch Later playlists into topic-based collections',
    icon: PiPlayCircle,
    status: 'Coming Soon',
    features: ['Topic detection', 'Auto sorting', 'Custom playlists'],
  },
];

export default function ToolsAndAgents() {
  const [articleExtractorOpen, setArticleExtractorOpen] = useState(false);
  const [bookmarkImporterOpen, setBookmarkImporterOpen] = useState(false);

  const handleTryAgent = (agentId: number) => {
    switch (agentId) {
      case 1: // Article Link Extractor
        setArticleExtractorOpen(true);
        break;
      case 6: // Bookmark File Importer
        setBookmarkImporterOpen(true);
        break;
      default:
        // For other agents, show coming soon message
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="border-border/30 hover:border-border/50 hover:shadow-sm transition-all duration-200"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <agent.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge
                  variant={agent.status === 'Active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {agent.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg leading-tight">
                  {agent.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {agent.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Features:
                </h4>
                <ul className="space-y-1">
                  {agent.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="outline"
                className="w-full"
                disabled={agent.status === 'Coming Soon'}
                onClick={() => handleTryAgent(agent.id)}
              >
                <PiArrowSquareOut className="h-4 w-4 mr-2" />
                Try Agent
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-lg bg-muted/30 border border-dashed border-border/30">
        <div className="text-center space-y-2">
          <PiRobot className="h-8 w-8 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">More Agents Coming Soon</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            New AI agents in development to enhance your bookmark management.
          </p>
        </div>
      </div>

      {/* Dialogs */}
      <ArticleExtractorDialog
        open={articleExtractorOpen}
        onOpenChange={setArticleExtractorOpen}
      />
      <BookmarkImporterDialog
        open={bookmarkImporterOpen}
        onOpenChange={setBookmarkImporterOpen}
      />
    </div>
  );
}
