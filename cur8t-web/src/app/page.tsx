"use client";

import React, { useState } from "react";
import Hero from "@/components/landingPage/Hero";
import Integrations from "@/components/landingPage/integrations";
import BrowserExtensionShowcase from "@/components/landingPage/BrowserExtensionShowcase";
import GitHubSyncAnimation from "@/components/landingPage/GitHubSyncAnimation";
import TweetCard from "@/components/landingPage/twittercard";
import CodeBlock from "@/components/landingPage/codeblock";
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
} from "@/components/landingPage/navbar";
import SimplePricing from "@/components/landingPage/pricing";
import ScrollBasedVelocityDemo from "@/components/landingPage/scollvelocity";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code2, Heart, MessageCircle } from "lucide-react";
import Faq1 from "@/components/landingPage/faq";
import Footer from "@/components/layout/Footer";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "Integrations", link: "#integrations" },
    { name: "About", link: "#about" },
    { name: "Contact", link: "#contact" },
  ];

  const handleNavItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation */}
      <Navbar className="fixed top-0 inset-x-0 z-50">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center space-x-2">
            <NavbarButton href="#signup" variant="primary">
              Get Started
            </NavbarButton>
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
                <a
                  key={idx}
                  href={item.link}
                  onClick={handleNavItemClick}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm"
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <NavbarButton
                  href="#signup"
                  variant="primary"
                  className="w-full"
                >
                  Get Started
                </NavbarButton>
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <main className="relative">
        <section id="home">
          <Hero />
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

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
