import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { PiSpinner } from 'react-icons/pi';

const LoadingCollections = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <PiSpinner className="h-4 w-4 animate-spin" />
            <span>Loading collections...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default LoadingCollections;
