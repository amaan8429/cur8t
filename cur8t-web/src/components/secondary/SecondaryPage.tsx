import React from "react";
import IntegrationsPage from "../integrations/IntegrationsPage";
import HelpPage from "../help/HelpPage";
import SettingsPage from "../settings/SettingsPage";
import { useActiveState } from "@/store/activeStateStore";

const SecondaryPage = () => {
  const activeSecondary = useActiveState.getState().activeSecondary;
  const activeUserId = useActiveState.getState().activeUserId;

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
};

export default SecondaryPage;
