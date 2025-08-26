'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiUpload,
  PiBrain,
  PiEye,
  PiCheckCircle,
  PiBookmark,
  PiFolderOpen,
  PiSparkle,
} from 'react-icons/pi';
import { Badge } from '@/components/ui/badge';

const BookmarkImporterAnimation = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      name: 'Upload',
      description: 'Import your browser bookmarks',
      icon: PiUpload,
      color: 'bg-primary',
      details: {
        browsers: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        fileType: 'HTML Export',
        icon: PiBookmark,
      },
    },
    {
      id: 2,
      name: 'Analyze',
      description: 'AI-powered categorization',
      icon: PiBrain,
      color: 'bg-secondary',
      details: {
        features: ['Smart Grouping', 'Topic Detection', 'Confidence Scoring'],
        icon: PiSparkle,
      },
    },
    {
      id: 3,
      name: 'Preview',
      description: 'Review and customize',
      icon: PiEye,
      color: 'bg-accent',
      details: {
        features: ['Edit Categories', 'Reorder Links', 'Custom Names'],
        icon: PiFolderOpen,
      },
    },
    {
      id: 4,
      name: 'Create',
      description: 'Generate organized collections',
      icon: PiCheckCircle,
      color: 'bg-primary',
      details: {
        features: ['Auto-Organized', 'Ready to Use', 'Shareable'],
        icon: PiCheckCircle,
      },
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
          >
            <PiBookmark className="text-primary mr-1 h-3.5 w-3.5" />
            Bookmark Importer
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
          >
            Import and organize your bookmarks
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-md pt-2 text-lg mx-auto"
          >
            Transform your browser bookmarks into beautifully organized
            collections with AI-powered categorization
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Mobile Layout - Stacked vertically */}
          <div className="block md:hidden">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative p-6 rounded-xl border bg-card transition-all duration-500 ${
                    activeStep === index
                      ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center`}
                    >
                      <step.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {step.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Step-specific details */}
                  <div className="space-y-3">
                    {step.details.browsers && (
                      <div className="flex flex-wrap gap-2">
                        {step.details.browsers.map((browser, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {browser}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {step.details.features && (
                      <div className="space-y-2">
                        {step.details.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <step.details.icon className="w-4 h-4 text-primary" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop Layout - Horizontal flow with connections */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Step Cards */}
              <div className="flex justify-between items-start">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative z-10 w-64 transition-all duration-500 ${
                      activeStep === index ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div
                      className={`relative p-6 rounded-xl border bg-card transition-all duration-500 ${
                        activeStep === index
                          ? 'border-primary shadow-lg shadow-primary/20'
                          : 'border-border'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div
                          className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-3`}
                        >
                          <step.icon className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {step.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {/* Step-specific content */}
                      <div className="space-y-3">
                        {step.details.browsers && (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {step.details.browsers.map((browser, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {browser}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {step.details.features && (
                          <div className="space-y-2">
                            {step.details.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <step.details.icon className="w-4 h-4 text-primary" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Connection Lines */}
              <svg
                width="100%"
                height="200"
                className="absolute top-1/2 left-0 -translate-y-1/2 -z-10"
              >
                {steps.slice(0, -1).map((_, index) => {
                  const startX = (index + 1) * 256; // Position based on card width
                  const endX = (index + 2) * 256;
                  const isActive = activeStep === index;

                  return (
                    <g key={index}>
                      {/* Base connection line */}
                      <path
                        d={`M ${startX + 64} 100 Q ${startX + 128} 100 ${endX + 64} 100`}
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-border"
                      />

                      {/* Animated active line */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.path
                            d={`M ${startX + 64} 100 Q ${startX + 128} 100 ${endX + 64} 100`}
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
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
                              path={`M ${startX + 64} 100 Q ${startX + 128} 100 ${endX + 64} 100`}
                            />
                          </motion.circle>
                        )}
                      </AnimatePresence>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeStep === index
                        ? 'bg-primary scale-125'
                        : 'bg-muted-foreground/30'
                    }`}
                    animate={{
                      scale: activeStep === index ? 1.25 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookmarkImporterAnimation;
