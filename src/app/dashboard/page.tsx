import { getSingleCollectionNameAction } from "@/actions/collection/getSingleCollectionName";
import { AppSidebar } from "@/components/Dashboard/Sidebar/app-sidebar";
import { ContentArea } from "@/components/Dashboard/ContentArea/content-area";
import { NavActions } from "@/components/Dashboard/NavActions/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useActiveState } from "@/store/activeStateStore";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsData = await searchParams;
  const activeItem = searchParamsData.item as string;
  const activeCollectionId = searchParamsData.collectionId as string;
  const activeSecondary = searchParamsData.secondary as string;

  let activeCollectionName = "";

  if (activeCollectionId) {
    activeCollectionName =
      await getSingleCollectionNameAction(activeCollectionId);
  }

  const setActiveItem = useActiveState.getState().setActiveItem;
  const setActiveCollectionId = useActiveState.getState().setActiveCollectionId;
  const setActiveSecondary = useActiveState.getState().setActiveSecondary;

  setActiveItem(activeItem || "");
  setActiveCollectionId(activeCollectionId || "");
  setActiveSecondary(activeSecondary || "");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbLink>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {activeItem || activeCollectionName || activeSecondary}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbLink>
            </Breadcrumb>
          </div>
          {activeCollectionId && <NavActions />}
        </header>
        <ContentArea />
      </SidebarInset>
    </SidebarProvider>
  );
}
