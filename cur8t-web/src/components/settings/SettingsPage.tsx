"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import ProfileSettings from "./ProfileSettings";
import GeneralSettings from "./GeneralSettings";
import LoadingSettings from "./Loading";
import APIKeySettings from "./ApiKeySettings";
import UsernameSettings from "./UsernameSettings";
import TopCollectionsSettings from "./TopCollectionsSettings";

const SettingsPage = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSettings />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto p-6 space-y-8">
      <ProfileSettings user={user} />
      <UsernameSettings />
      <TopCollectionsSettings />
      <GeneralSettings />
      <APIKeySettings />
    </div>
  );
};

export default SettingsPage;
