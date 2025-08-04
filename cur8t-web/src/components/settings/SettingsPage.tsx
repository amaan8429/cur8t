"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "./ProfileSettings";
import GeneralSettings from "./GeneralSettings";
import LoadingSettings from "./Loading";
import APIKeySettings from "./ApiKeySettings";
import TopCollectionsSettings from "./TopCollectionsSettings";
import SocialMediaSettings from "./SocialMediaSettings";
import FavoritesPage from "./FavoritesPage";

const SettingsPage = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  if (!isLoaded) {
    return <LoadingSettings />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto p-6 max-w-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8 bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 ease-in-out hover:bg-muted"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="collections"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 ease-in-out hover:bg-muted"
          >
            Collections
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 ease-in-out hover:bg-muted"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 ease-in-out hover:bg-muted"
          >
            API Keys
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 ease-in-out hover:bg-muted"
          >
            Social
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 ease-in-out hover:bg-muted"
          >
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="profile"
          className="space-y-6 animate-in fade-in-0 slide-in-from-right-2 duration-300"
        >
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent
          value="collections"
          className="space-y-6 animate-in fade-in-0 slide-in-from-right-2 duration-300"
        >
          <TopCollectionsSettings />
        </TabsContent>

        <TabsContent
          value="general"
          className="space-y-6 animate-in fade-in-0 slide-in-from-right-2 duration-300"
        >
          <GeneralSettings />
        </TabsContent>

        <TabsContent
          value="api"
          className="space-y-6 animate-in fade-in-0 slide-in-from-right-2 duration-300"
        >
          <APIKeySettings />
        </TabsContent>

        <TabsContent
          value="social"
          className="space-y-6 animate-in fade-in-0 slide-in-from-right-2 duration-300"
        >
          <SocialMediaSettings />
        </TabsContent>

        <TabsContent
          value="favorites"
          className="space-y-6 animate-in fade-in-0 slide-in-from-right-2 duration-300"
        >
          <FavoritesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
