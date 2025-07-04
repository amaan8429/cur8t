import React from "react";
import IntegrationsPage from "../integrations/IntegrationsPage";
import HelpPage from "../help/HelpPage";
import SettingsPage from "../settings/SettingsPage";
import { useActiveState } from "@/store/activeStateStore";

const SecondaryPage = () => {
  const activeSecondary = useActiveState.getState().activeSecondary;

  if (activeSecondary === "Integrations") {
    return <IntegrationsPage />;
  } else if (activeSecondary === "Settings") {
    return <SettingsPage />;
  } else if (activeSecondary === "Help") {
    return <HelpPage />;
  }
};

export default SecondaryPage;
