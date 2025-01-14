"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import ProfileSettings from "./profile-settings";
import GeneralSettings from "./general-settings";
import LoadingSettings from "./loading";
import APIKeySettings from "./api-key-settings";

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
      <GeneralSettings />
      <APIKeySettings />
    </div>
  );
};

export default SettingsPage;
