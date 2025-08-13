'use client';

import React, { useState } from 'react';
import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import Hero from '@/components/landingPage/Hero';
import Integrations from '@/components/landingPage/integrations';
import BrowserExtensionShowcase from '@/components/landingPage/BrowserExtensionShowcase';
import GitHubSyncAnimation from '@/components/landingPage/GitHubSyncAnimation';
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

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

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
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/dashboard?item=Overview"
              >
                <NavbarButton variant="primary" as="button">
                  Get Started
                </NavbarButton>
              </SignUpButton>
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

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-muted/20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/dashboard?item=Overview"
              >
                <Button className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton
                mode="modal"
                forceRedirectUrl="/dashboard?item=Overview"
              >
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
