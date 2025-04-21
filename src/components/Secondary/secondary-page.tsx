import React from "react";
import IntegrationsPage from "./integrations/integrations-page";
import HelpPage from "./help/help-page";
import TrashPage from "./trash/trash-page";
import SettingsPage from "./settings/settings-page";
import { useActiveState } from "@/store/activeStateStore";

const SecondaryPage = () => {
  const activeSecondary = useActiveState.getState().activeSecondary;

  if (activeSecondary === "Integrations") {
    return <IntegrationsPage />;
  } else if (activeSecondary === "Settings") {
    return <SettingsPage />;
  } else if (activeSecondary === "Trash") {
    return <TrashPage />;
  } else if (activeSecondary === "Help") {
    return <HelpPage />;
  }
};

export default SecondaryPage;
