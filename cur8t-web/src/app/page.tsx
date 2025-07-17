"use client";

import React, { useState } from "react";
import Hero from "@/components/landingPage/Hero";
import Integrations from "@/components/landingPage/integrations";
import BrowserExtensionShowcase from "@/components/landingPage/BrowserExtensionShowcase";
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

        {/* Browser Extension Showcase */}
        <BrowserExtensionShowcase />

        {/* Placeholder sections for the other nav links */}
        <section
          id="about"
          className="min-h-screen bg-muted/10 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              About Cur8t
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your personal content curation platform. Organize, manage, and
              discover the best content across all your favorite platforms.
            </p>
          </div>
        </section>

        <section
          id="contact"
          className="min-h-screen bg-background flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-8">
              Ready to start curating? Have questions? We&apos;d love to hear
              from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Start Free Trial
              </button>
              <button className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
