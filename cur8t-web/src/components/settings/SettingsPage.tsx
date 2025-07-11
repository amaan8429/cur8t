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
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="collections"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Collections
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            API Keys
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <TopCollectionsSettings />
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <APIKeySettings />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SocialMediaSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
