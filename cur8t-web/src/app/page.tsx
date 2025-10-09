'use client';

import React, { useEffect, useState } from 'react';
import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import Hero from '@/components/landingPage/Hero';
import Integrations from '@/components/landingPage/integrations';
import BrowserExtensionShowcase from '@/components/landingPage/BrowserExtensionShowcase';
import GitHubSyncAnimation from '@/components/landingPage/GitHubSyncAnimation';
import BookmarkImporterAnimation from '@/components/landingPage/BookmarkImporterAnimation';
import TweetCard from '@/components/landingPage/twittercard';
import CodeBlock from '@/components/landingPage/codeblock';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from '@/components/landingPage/navbar';
import SimplePricing from '@/components/landingPage/pricing';
import dynamic from 'next/dynamic';

// Lazy load heavy scroll component for better initial performance
const ScrollBasedVelocityDemo = dynamic(
  () => import('@/components/landingPage/scollvelocity'),
  {
    ssr: false, // Disable SSR for this component to avoid hydration issues
    loading: () => (
      <div className="bg-background py-16 border-t border-border/50">
        <div className="px-6 text-center text-4xl font-bold tracking-tight text-foreground/80 dark:text-foreground md:text-7xl md:leading-[5rem]">
          Organize • Discover • Share • Cur8t
        </div>
      </div>
    ),
  }
);
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { PiCode, PiHeart, PiChatCircle } from 'react-icons/pi';
import Faq1 from '@/components/landingPage/faq';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { Star } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/animated-number';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const [githubStars, setGithubStars] = useState(0);

  const navItems = [
    { name: 'Home', link: '#home' },
    { name: 'Integrations', link: '#integrations' },
    { name: 'Pricing', link: '#pricing' },
    { name: 'FAQ', link: '#faq' },
  ];

  const handleNavItemClick = () => {
    setIsOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const githubStarsCount = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/amaan8429/cur8t',
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub stars');
        }
        const data = await response.json();
        setGithubStars(data.stargazers_count || 0);
      } catch (error) {
        console.error('Failed to fetch GitHub stars', error);
        setGithubStars(0);
      }
    };
    githubStarsCount();
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-background transform-gpu"
      style={{ willChange: 'auto' }}
    >
      {/* Navigation */}
      <Navbar className="fixed top-0 inset-x-0 z-50">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems}
            onItemClick={() => scrollToSection('#home')}
          />
          <div className="flex items-center space-x-2">
            {isSignedIn ? (
              <Link href="/dashboard?item=Overview">
                <NavbarButton variant="primary" as="button">
                  Dashboard
                </NavbarButton>
              </Link>
            ) : (
              <>
                <Link
                  href={'https://github.com/amaan8429/cur8t'}
                  target="_blank"
                  className="cursor-pointer group"
                >
                  <NavbarButton
                    variant="secondary"
                    as="button"
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-1">
                      <FaGithub className="size-4 mb-[2px]" />
                      <span>Github</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="size-4 mb-[2px] fill-gray-400 duration-300 group-hover:fill-yellow-400 group-hover:stroke-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                      <AnimatedNumber
                        value={githubStars}
                        className="font-medium text-white"
                      />
                    </div>
                  </NavbarButton>
                </Link>
                <SignUpButton
                  mode="modal"
                  forceRedirectUrl="/dashboard?item=Overview"
                >
                  <NavbarButton variant="primary" as="button">
                    Get Started
                  </NavbarButton>
                </SignUpButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col space-y-4 w-full">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleNavItemClick();
                    scrollToSection(item.link);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm text-left w-full"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {isSignedIn ? (
                  <Link href="/dashboard?item=Overview">
                    <NavbarButton
                      onClick={() => setIsOpen(false)}
                      variant="primary"
                      className="w-full"
                      as="button"
                    >
                      Dashboard
                    </NavbarButton>
                  </Link>
                ) : (
                  <SignUpButton
                    mode="modal"
                    forceRedirectUrl="/dashboard?item=Overview"
                  >
                    <NavbarButton
                      onClick={() => setIsOpen(false)}
                      variant="primary"
                      className="w-full"
                      as="button"
                    >
                      Get Started
                    </NavbarButton>
                  </SignUpButton>
                )}
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <main className="relative">
        <section id="home">
          <Hero isSignedIn={!!isSignedIn} />
        </section>

        {/* Integrations Section */}
        <section id="integrations">
          <Integrations />
        </section>

        {/* GitHub Sync Animation */}
        <GitHubSyncAnimation />

        {/* Bookmark Importer Animation */}
        <BookmarkImporterAnimation />

        {/* Browser Extension Showcase */}
        <BrowserExtensionShowcase />

        {/* Pricing Section */}
        <section id="pricing">
          <SimplePricing />
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <Faq1 />
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
