// import { Navbar } from "@/components/navbar";
import Hero from "@/components/LandingPage/hero";
import Tweets from "@/components/LandingPage/tweets";
import React from "react";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <Hero />
      <Tweets />
      {/* <Logos />
      <Features />
      <PricingTable /> */}
    </div>
  );
};

export default Home;
