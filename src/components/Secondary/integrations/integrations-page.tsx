import { Button } from "@/components/ui/button";
import React from "react";

const IntegrationsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3>Connect GitHub</h3>
        <p>Connect your GitHub account to manage your repositories.</p>
        <Button>Connect</Button>
      </div>
      <div>
        <h3>Install our VS Code Extension</h3>
        <p>
          Extension to add your vs code extensions directly as a collection.
        </p>
        <Button>Connect</Button>
      </div>
      <div>
        <h3>CLI tool</h3>
        <p>
          use the cli tool to interact with your collections using the terminal
        </p>
        <Button>Connect</Button>
      </div>
      <div>
        <h3>Browser Extension</h3>
        <p>
          Use the browser extension to add links to your collections directly
          from your browser.
        </p>
        <Button>Connect</Button>
      </div>
    </div>
  );
};

export default IntegrationsPage;
