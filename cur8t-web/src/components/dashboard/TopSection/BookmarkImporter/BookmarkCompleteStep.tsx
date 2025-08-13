import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PiFolderOpen, PiCheckCircle, PiArrowSquareOut } from 'react-icons/pi';
import { motion } from 'framer-motion';
import { useBookmarkImporter } from './useBookmarkImporter';

interface Props {
  importer: ReturnType<typeof useBookmarkImporter>;
  onOpenChange: (open: boolean) => void;
}

export function BookmarkCompleteStep({ importer, onOpenChange }: Props) {
  const { createdCollections } = importer;
  return (
    <div className="space-y-4">
      <Card className="border-primary/20 dark:border-primary/30">
        <CardContent className="pt-8 pb-6">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-xl scale-150 opacity-30"></div>
              <PiCheckCircle className="h-16 w-16 text-primary mx-auto relative" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Collections Created Successfully!
              </h3>
              <p className="text-muted-foreground/90 max-w-md mx-auto leading-relaxed">
                Your bookmarks have been intelligently imported and organized
                into{' '}
                <span className="font-semibold text-primary">
                  {createdCollections.length} smart collections
                </span>
                . Click on any collection below to view and manage your links.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {createdCollections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiFolderOpen className="h-4 w-4" />
              Created Collections
            </CardTitle>
            <CardDescription>
              Click on any collection to view and manage its links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {createdCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20"
                    onClick={() => {
                      window.open(`/collection/${collection.id}`, '_blank');
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                            <PiFolderOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-base">
                              {collection.title}
                            </h4>
                            <p className="text-sm text-muted-foreground/90 mt-1">
                              {collection.linksCount} links imported
                              successfully
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                          >
                            {collection.linksCount} links
                          </Badge>
                          <PiArrowSquareOut className="h-5 w-5 text-muted-foreground/70" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex-1 h-11 border-muted-foreground/30 hover:bg-muted/50"
        >
          Close Dialog
        </Button>
        <Button
          onClick={() => {
            window.open('/dashboard?item=Overview', '_blank');
            onOpenChange(false);
          }}
          className="flex-1 h-11 bg-primary hover:bg-primary/90"
        >
          <PiFolderOpen className="h-5 w-5 mr-2" />
          Open Dashboard
        </Button>
      </div>
    </div>
  );
}
