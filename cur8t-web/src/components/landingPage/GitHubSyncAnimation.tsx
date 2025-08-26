'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiGitBranch, PiDatabase, PiLightning } from 'react-icons/pi';
import { Badge } from '@/components/ui/badge';

const GitHubSyncAnimation = () => {
  const [activeSync, setActiveSync] = useState(0);

  const collections = [
    { id: 1, name: 'Web Dev Tools', count: 25, color: 'bg-blue-500' },
    { id: 2, name: 'Design Resources', count: 18, color: 'bg-purple-500' },
    { id: 3, name: 'AI/ML Papers', count: 32, color: 'bg-green-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSync((prev) => (prev + 1) % collections.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [collections.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
          >
            <PiLightning className="text-primary mr-1 h-3.5 w-3.5" />
            GitHub Integration
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
          >
            Sync your collections to GitHub
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-md pt-2 text-lg mx-auto"
          >
            Sync your links and collections to your GitHub for better storage.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Mobile Layout - Stacked vertically */}
          <div className="block md:hidden">
            <div className="space-y-8">
              {/* Collections Section */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Your Collections
                </h3>
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                  <PiDatabase className="w-5 h-5" />
                  <span>Cur8t</span>
                </div>

                <div className="space-y-4">
                  {collections.map((collection, index) => (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`relative p-4 rounded-xl border bg-card transition-all duration-500 ${
                        activeSync === index
                          ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${collection.color}`}
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {collection.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {collection.count} links
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sync Animation - Simplified for mobile */}
              <div className="flex justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
                >
                  <PiLightning className="w-8 h-8 text-primary" />
                </motion.div>
              </div>

              {/* GitHub Repo Section */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  GitHub Repository
                </h3>
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                  <PiGitBranch className="w-5 h-5" />
                  <span>Your GitHub</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-6 rounded-xl border border-primary bg-card shadow-lg mx-auto max-w-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <PiGitBranch className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        awesome-collection
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ⭐ 2.8k stars
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Contains:
                    </div>
                    {collections.map((collection, index) => (
                      <motion.div
                        key={collection.id}
                        className={`flex items-center gap-2 p-2 rounded text-sm transition-all duration-300 ${
                          activeSync === index
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${collection.color}`}
                        />
                        <span>{collection.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Keep exactly as it was */}
          <div className="hidden md:flex relative items-center justify-between">
            {/* Collections Side */}
            <div className="flex flex-col space-y-8 w-2/5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Your Collections
                </h3>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <PiDatabase className="w-5 h-5" />
                  <span>Cur8t</span>
                </div>
              </div>

              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative p-4 rounded-xl border bg-card transition-all duration-500 ${
                    activeSync === index
                      ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${collection.color}`}
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {collection.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {collection.count} links
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Animated Connections */}
            <div className="flex-1 relative h-80 flex items-center justify-center">
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Connection lines from each collection to the repo */}
                {collections.map((_, index) => {
                  const startY = 120 + index * 80; // Position based on collection
                  const endY = 200; // Center position for the repo
                  const isActive = activeSync === index;

                  return (
                    <g key={index}>
                      {/* Base connection line */}
                      <path
                        d={`M 50 ${startY} Q 150 ${startY} 250 ${endY}`}
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                        className="text-border"
                      />

                      {/* Animated active line */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.path
                            d={`M 50 ${startY} Q 150 ${startY} 250 ${endY}`}
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            exit={{ pathLength: 0, opacity: 0 }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Flowing dots */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.circle
                            r="4"
                            fill="hsl(var(--primary))"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <animateMotion
                              dur="2s"
                              repeatCount="indefinite"
                              path={`M 50 ${startY} Q 150 ${startY} 250 ${endY}`}
                            />
                          </motion.circle>
                        )}
                      </AnimatePresence>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* GitHub Repo */}
            <div className="w-2/5 flex flex-col items-center">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  GitHub Repository
                </h3>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <PiGitBranch className="w-5 h-5" />
                  <span>Your GitHub</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative p-6 rounded-xl border border-primary bg-card shadow-lg w-full max-w-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <PiGitBranch className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground text-lg">
                      awesome-collection
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ⭐ 2.8k stars
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Contains:</div>
                  {collections.map((collection, index) => (
                    <motion.div
                      key={collection.id}
                      className={`flex items-center gap-2 p-2 rounded text-sm transition-all duration-300 ${
                        activeSync === index
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${collection.color}`}
                      />
                      <span>{collection.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubSyncAnimation;
