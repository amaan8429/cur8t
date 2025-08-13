'use client';

import { PiGithubLogo, PiEnvelope } from 'react-icons/pi';
import Image from 'next/image';
import Link from 'next/link';

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
              src="/logo.png"
              alt="Cur8t Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-xl font-semibold text-foreground">Cur8t</span>
          </Link>
          <p className="text-muted-foreground mb-6 max-w-xs text-center text-sm md:text-left">
            Organize, discover, and share your links with smart collections.
            Never lose track of important content again.
          </p>
          <div className="mt-2 flex gap-3">
            <a
              href="https://github.com/amaan8429"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <PiGithubLogo className="h-5 w-5" />
            </a>
            <a
              href="mailto:amaanrizvi73@gmail.com"
              aria-label="Email"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <PiEnvelope className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex w-full flex-col gap-8 text-center md:w-auto md:flex-row md:justify-end md:text-left">
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('integrations');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('pricing');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <Link
                  href="/dashboard/?item=Overview"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              Legal
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('faq');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Copyright */}
      <div className="relative z-10 mt-10 text-center text-xs text-muted-foreground">
        <span>&copy; 2025 Cur8t. Made with ❤️ for better link management.</span>
      </div>
    </footer>
  );
}

export default Footer;
