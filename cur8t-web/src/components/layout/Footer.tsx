"use client";

import { PiGithubLogo, PiEnvelope, PiTwitterLogo } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-8 w-full overflow-hidden pt-16 pb-8">
      {/* Background gradients */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl"></div>
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl"></div>
      </div>

      {/* Glass container */}
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-2xl border border-border/20 bg-card/50 backdrop-blur-sm px-6 py-10 shadow-lg md:flex-row md:items-start md:justify-between md:gap-12">
        {/* Company info */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="mb-4 flex items-center gap-2">
            <Image
              src="/cur8tlogo.png"
              alt="Cur8t Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-xl font-semibold text-foreground">Cur8t</span>
          </Link>
          <p className="text-muted-foreground mb-6 max-w-xs text-center text-sm md:text-left">
            Organize, discover, and share your bookmarks with smart collections.
            Never lose track of important content again.
          </p>
          <div className="mt-2 flex gap-3">
            <Link
              href="https://twitter.com/cur8t"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <PiTwitterLogo className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/cur8t"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <PiGithubLogo className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:hello@cur8t.com"
              aria-label="Email"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <PiEnvelope className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex w-full flex-col gap-9 text-center md:w-auto md:flex-row md:justify-end md:text-left">
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#integrations"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#integrations"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              Company
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              Resources
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Copyright */}
      <div className="relative z-10 mt-10 text-center text-xs text-muted-foreground">
        <span>
          &copy; 2025 Cur8t. All rights reserved. Made with ❤️ for better
          bookmarking.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
