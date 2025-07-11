import React from "react";
import IntegrationsPage from "../integrations/IntegrationsPage";
import HelpPage from "../help/HelpPage";
import SettingsPage from "../settings/SettingsPage";
import { useActiveState } from "@/store/activeStateStore";

const SecondaryPage = () => {
  // Use the proper hook instead of getState() during render
  const activeSecondary = useActiveState((state) => state.activeSecondary);
  const activeUserId = useActiveState((state) => state.activeUserId);

  if (activeSecondary === "Integrations") {
    return <IntegrationsPage />;
  } else if (activeSecondary === "Settings") {
    return <SettingsPage />;
  } else if (activeSecondary === "Profile") {
    if (activeUserId) {
      return window.open(`/profile?userId=${activeUserId}`, "_blank");
    }
    return null;
  }

  return null;
};

export default SecondaryPage;
