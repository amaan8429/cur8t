"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  // State for animated counters
  const [stats, setStats] = useState({
    users: 500,
    transactions: 1500,
    networks: 40,
  });

  // Animation to count up numbers
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
    }, 50);

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
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background pt-24 pb-16 text-foreground sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 h-full w-full rotate-180 items-center px-5 py-24 opacity-80 [background:radial-gradient(125%_125%_at_50%_10%,hsl(var(--background))_40%,hsl(var(--primary))_100%)]"></div>
      <svg
        id="noice"
        className="absolute inset-0 z-10 h-full w-full opacity-30"
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

      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-background/70 to-muted blur-3xl"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,hsl(var(--foreground)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Enhanced glow spots */}
        <div className="absolute -left-20 top-20 h-60 w-60 rounded-full bg-primary/20 blur-[100px]"></div>
        <div className="absolute -right-20 bottom-20 h-60 w-60 rounded-full bg-accent/20 blur-[100px]"></div>
        <motion.div
          animate={glowAnimation}
          className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-primary/10 blur-[80px]"
        ></motion.div>
        <motion.div
          animate={glowAnimation}
          className="absolute bottom-1/3 right-1/4 h-40 w-40 rounded-full bg-accent/10 blur-[80px]"
        ></motion.div>

        {/* Particle effects - subtle dots */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => {
            // Use consistent values based on index to avoid hydration issues
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
              { top: 85, left: 55 },
              { top: 25, left: 75 },
              { top: 55, left: 10 },
              { top: 95, left: 40 },
              { top: 30, left: 80 },
              { top: 70, left: 35 },
              { top: 5, left: 65 },
              { top: 45, left: 50 },
              { top: 60, left: 85 },
              { top: 15, left: 45 },
            ];
            const durations = [
              3, 4, 3.5, 4.5, 3.2, 4.8, 3.8, 4.2, 3.6, 4.4, 3.4, 4.6, 3.1, 4.1,
              3.7, 4.3, 3.9, 4.7, 3.3, 4.9,
            ];
            const delays = [
              0, 0.5, 1, 1.5, 0.2, 0.7, 1.2, 1.7, 0.4, 0.9, 1.4, 1.9, 0.1, 0.6,
              1.1, 1.6, 0.3, 0.8, 1.3, 1.8,
            ];

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
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Cur8t
          </span>
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
            className="group rounded-full border-t border-primary bg-gradient-to-b from-primary to-background/80 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40"
            size="lg"
          >
            Try now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          <Button variant="outline" className="rounded-full" size="lg">
            Learn more
          </Button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div variants={itemVariants} className="mb-8 w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/10 p-2 shadow-2xl shadow-primary/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/dashboard.png"
                alt="Cur8t Dashboard Preview"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Overlay gradient for better integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
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

      {/* Bottom gradient effects */}
      <div className="absolute -bottom-40 left-1/2 h-96 w-20 -translate-x-1/2 -rotate-45 rounded-full bg-muted/30 blur-[80px]"></div>
      <div className="absolute -bottom-52 left-1/2 h-96 w-20 -translate-x-1/2 -rotate-45 rounded-full bg-muted/20 blur-[80px]"></div>
      <div className="absolute -bottom-60 left-1/3 h-96 w-10 -translate-x-20 -rotate-45 rounded-full bg-muted/20 blur-[80px]"></div>
    </section>
  );
}
