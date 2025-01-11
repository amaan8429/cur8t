import React from "react";
import IntegrationsPage from "./integrations/integrations-page";
import HelpPage from "./help/help-page";
import TrashPage from "./trash/trash-page";
import { ModeToggle } from "../mode-toggle";

const SecondaryPage = ({ activeSecondary }: { activeSecondary: string }) => {
  if (activeSecondary === "Integrations") {
    return <IntegrationsPage />;
  } else if (activeSecondary === "Settings") {
    return <HelpPage />;
  } else if (activeSecondary === "Trash") {
    return <TrashPage />;
  } else if (activeSecondary === "Help") {
    return <TrashPage />;
  }
};

export default SecondaryPage;
