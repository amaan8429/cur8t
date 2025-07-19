import React, { useEffect } from "react";
import IntegrationsPage from "../integrations/IntegrationsPage";
import HelpPage from "../help/HelpPage";
import SettingsPage from "../settings/SettingsPage";
import { useActiveState } from "@/store/activeStateStore";

const SecondaryPage = () => {
  // Use the proper hook instead of getState() during render
  const activeSecondary = useActiveState((state) => state.activeSecondary);
  const activeUserId = useActiveState((state) => state.activeUserId);

  // Handle Profile navigation as a side effect
  useEffect(() => {
    if (activeSecondary === "Profile" && activeUserId) {
      window.open(`/profile?userId=${activeUserId}`, "_blank");
    }
  }, [activeSecondary, activeUserId]);

  if (activeSecondary === "Integrations") {
    return <IntegrationsPage />;
  } else if (activeSecondary === "Settings") {
    return <SettingsPage />;
  } else if (activeSecondary === "Profile") {
    // Return a loading state or placeholder while opening the profile
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Opening profile...</p>
      </div>
    );
  }

  return null;
};

export default SecondaryPage;
