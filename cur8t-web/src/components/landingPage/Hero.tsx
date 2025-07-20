"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Globe,
  Chrome,
  Share2,
  Search,
  Star,
  Heart,
  Zap,
  Sparkles,
  Tag,
} from "lucide-react";
import Image from "next/image";

export default function Hero() {
  // State for animated counters
  const [stats, setStats] = useState({
    users: 500,
    transactions: 1500,
    networks: 40,
  });

  // Animation to count up numbers - optimized interval
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const newUsers = prev.users >= 20000 ? 20000 : prev.users + 500;
        const newTransactions =
          prev.transactions >= 1500000 ? 1500000 : prev.transactions + 37500;
        const newNetworks = prev.networks >= 40 ? 40 : prev.networks + 1;

        if (
          newUsers === 20000 &&
          newTransactions === 1500000 &&
          newNetworks === 40
        ) {
          clearInterval(interval);
        }

        return {
          users: newUsers,
          transactions: newTransactions,
          networks: newNetworks,
        };
      });
    }, 150); // Reduced frequency for better mobile performance

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Glowing effect animation
  const glowAnimation = {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 pt-24 pb-16 text-foreground sm:px-6 lg:px-8">
      {/* Simplified Background for Mobile */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,hsl(var(--primary)/0.12),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_80%_20%,hsl(var(--accent)/0.08),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_50%_80%,hsl(var(--primary)/0.06),transparent)]"></div>
      </div>

      {/* Noise effect - hidden on mobile for performance */}
      <svg
        id="noice"
        className="absolute inset-0 z-10 h-full w-full opacity-20 hidden md:block"
      >
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.34"
            numOctaves="4"
            stitchTiles="stitch"
          ></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.46"></feFuncR>
            <feFuncG type="linear" slope="0.46"></feFuncG>
            <feFuncB type="linear" slope="0.47"></feFuncB>
            <feFuncA type="linear" slope="0.37"></feFuncA>
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.47" intercept="-0.23" />
            <feFuncG type="linear" slope="1.47" intercept="-0.23" />
            <feFuncB type="linear" slope="1.47" intercept="-0.23" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)"></rect>
      </svg>

      {/* Enhanced Background Effects - Reduced on mobile */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Grid Pattern - Hidden on mobile */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] hidden md:block">
          <div className="h-full w-full bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:6rem_6rem]"></div>
        </div>

        {/* Modern Floating Orbs - Simplified for mobile */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 h-32 w-32 md:h-72 md:w-72 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"
        ></motion.div>

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 h-48 w-48 md:h-96 md:w-96 rounded-full bg-gradient-to-l from-accent/15 to-primary/15 blur-3xl"
        ></motion.div>

        {/* Central rotating orb - hidden on mobile */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-gradient-conic from-primary/10 via-accent/5 to-primary/10 blur-2xl hidden md:block"
        ></motion.div>

        {/* Floating Icons - Hidden on mobile devices */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          {/* Bookmark Icon - Top Left */}
          <motion.div
            className="absolute top-32 left-8 md:left-16 p-3 rounded-xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Bookmark className="h-6 w-6 text-primary" />
          </motion.div>

          {/* Globe Icon - Top Right */}
          <motion.div
            className="absolute top-40 right-8 md:right-16 p-2.5 rounded-xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
            animate={{
              y: [0, 12, 0],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Globe className="h-5 w-5 text-primary" />
          </motion.div>

          {/* Chrome Icon - Top Center Right */}
          <motion.div
            className="absolute top-24 right-24 md:right-32 p-3 rounded-xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
            animate={{
              y: [0, -18, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Chrome className="h-6 w-6 text-primary" />
          </motion.div>

          {/* Search Icon - Bottom Right */}
          <motion.div
            className="absolute bottom-32 right-12 md:right-20 p-3 rounded-xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 4, 0],
            }}
            transition={{
              duration: 6.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <Search className="h-6 w-6 text-primary" />
          </motion.div>

          {/* Share Icon - Bottom Left */}
          <motion.div
            className="absolute bottom-40 left-12 md:left-20 p-2.5 rounded-xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -2, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Share2 className="h-5 w-5 text-primary" />
          </motion.div>

          {/* Star Icon - Middle Left */}
          <motion.div
            className="absolute top-60 left-6 md:left-12 p-2.5 rounded-xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
            animate={{
              y: [0, 10, 0],
              rotate: [0, -3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 3,
            }}
          >
            <Star className="h-5 w-5 text-primary" />
          </motion.div>

          {/* Sparkles Icon - Middle Right */}
          <motion.div
            className="absolute top-64 right-6 md:right-12 p-2.5 rounded-xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 6, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1.8,
            }}
          >
            <Sparkles className="h-5 w-5 text-primary" />
          </motion.div>

          {/* Zap Icon - Bottom Center */}
          <motion.div
            className="absolute bottom-20 left-20 md:left-32 p-3 rounded-xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
            animate={{
              y: [0, 16, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 5.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <Zap className="h-6 w-6 text-primary" />
          </motion.div>
        </div>

        {/* Particle effects - Reduced for mobile */}
        <div className="absolute inset-0 opacity-20 hidden md:block">
          {Array.from({ length: 10 }).map((_, i) => {
            // Reduced from 20 to 10 particles
            const positions = [
              { top: 15, left: 25 },
              { top: 75, left: 85 },
              { top: 35, left: 70 },
              { top: 90, left: 15 },
              { top: 50, left: 45 },
              { top: 20, left: 60 },
              { top: 80, left: 30 },
              { top: 10, left: 90 },
              { top: 65, left: 20 },
              { top: 40, left: 95 },
            ];
            const durations = [3, 4, 3.5, 4.5, 3.2, 4.8, 3.8, 4.2, 3.6, 4.4];
            const delays = [0, 0.5, 1, 1.5, 0.2, 0.7, 1.2, 1.7, 0.4, 0.9];

            return (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-foreground"
                style={{
                  top: `${positions[i]?.top || 50}%`,
                  left: `${positions[i]?.left || 50}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: durations[i] || 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: delays[i] || 0,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Centered and Sequential */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-8"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
        >
          <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            New
          </span>
          Introducing Cur8t
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 bg-gradient-to-r from-foreground/70 via-foreground to-muted-foreground/80 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Curate your stuff with{" "}
          <motion.span
            className="relative inline-block text-primary font-semibold"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <span className="relative z-10">Cur8t</span>
            {/* Animated glow effect */}
            <motion.div
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute inset-0 bg-primary/20 blur-sm rounded-lg"
            />
            {/* Shimmer effect */}
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                repeatDelay: 2,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 overflow-hidden"
            />
          </motion.span>
        </motion.h1>
        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          just a stupid side project turned into something that might be useful
        </motion.p>

        {/* Animated Stats Row */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-wrap justify-center gap-4 md:gap-6"
        >
          <div className="rounded-lg border border-primary/20 bg-card/40 px-6 py-3 backdrop-blur-sm">
            <p className="text-2xl font-semibold text-foreground sm:text-3xl">
              {stats.users.toLocaleString()}+
            </p>
            <p className="text-sm text-muted-foreground">Users</p>
          </div>
          <div className="rounded-lg border border-accent/20 bg-card/40 px-6 py-3 backdrop-blur-sm">
            <p className="text-2xl font-semibold text-foreground sm:text-3xl">
              {stats.transactions.toLocaleString()}+
            </p>
            <p className="text-sm text-muted-foreground">Collections</p>
          </div>
          <div className="rounded-lg border border-ring/20 bg-card/40 px-6 py-3 backdrop-blur-sm">
            <p className="text-2xl font-semibold text-foreground sm:text-3xl">
              {stats.networks}+
            </p>
            <p className="text-sm text-muted-foreground">Integrations</p>
          </div>
        </motion.div>

        {/* Integration badges */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-sm font-medium text-muted-foreground mr-2">
            Integrates with:
          </span>
          <div className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm font-medium text-card-foreground backdrop-blur-sm transition-all hover:bg-accent">
            <div className="h-2 w-2 rounded-full bg-accent"></div>
            Browser
          </div>
          <div className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm font-medium text-card-foreground backdrop-blur-sm transition-all hover:bg-accent">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            Web App
          </div>
          <div className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm font-medium text-card-foreground backdrop-blur-sm transition-all hover:bg-accent">
            <div className="h-2 w-2 rounded-full bg-ring"></div>
            VS Code
          </div>
          <div className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm font-medium text-card-foreground backdrop-blur-sm transition-all hover:bg-accent">
            <div className="h-2 w-2 rounded-full bg-secondary"></div>
            +5 more
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mb-12 flex flex-col gap-4 sm:flex-row"
        >
          <Button
            className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            size="lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            className="border-2 border-border hover:border-primary bg-background/50 backdrop-blur-sm text-foreground hover:text-primary hover:bg-primary/5 px-8 py-6 text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
            size="lg"
          >
            Learn more
          </Button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div variants={itemVariants} className="mb-8 w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/10 p-2 shadow-2xl shadow-primary/10 backdrop-blur-sm">
            {/* Moving Light Spots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -inset-1 rounded-2xl"
            >
              <div className="absolute top-0 left-1/4 w-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"></div>
              <div className="absolute bottom-0 right-1/3 w-6 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent blur-sm"></div>
            </motion.div>

            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/dashboard.png"
                alt="Cur8t Dashboard Preview"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent"></div>
            </div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-8 overflow-hidden rounded-full border-2 border-border bg-muted"
              >
                <div className="h-full w-full bg-gradient-to-br from-primary to-accent opacity-80"></div>
              </div>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">500+</span> users
            already curating
          </span>
          <ArrowUpRight className="h-4 w-4 text-primary" />
        </motion.div>
      </motion.main>

      {/* Bottom Accent Effects */}
      <div className="absolute -bottom-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-t from-primary/10 to-transparent blur-3xl"></div>
      <div className="absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-gradient-to-tl from-accent/8 to-transparent blur-2xl"></div>
    </section>
  );
}
