import React, { useEffect } from "react";
import IntegrationsPage from "../integrations/IntegrationsPage";
import HelpPage from "../help/HelpPage";
import SettingsPage from "../settings/SettingsPage";
import { useActiveState } from "@/store/activeStateStore";
import SavedCollections from "../dashboard/TopSection/SavedCollections";
import ToolsAndAgents from "../dashboard/TopSection/ToolsAndAgents";
import { useRouter } from "next/navigation";

const SecondaryPage = () => {
  // Use the proper hook instead of getState() during render
  const activeSecondary = useActiveState((state) => state.activeSecondary);
  const activeUserId = useActiveState((state) => state.activeUserId);
  const router = useRouter();

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
  } else if (activeSecondary === "Saved Collections") {
    return <SavedCollections />;
  } else if (activeSecondary === "Tools and Agents") {
    return <ToolsAndAgents />;
  } else if (activeSecondary === "Explore Collections") {
    router.push("/explore");
  }

  return null;
};

export default SecondaryPage;
