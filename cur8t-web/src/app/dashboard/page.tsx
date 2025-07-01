import { getSingleCollectionNameAction } from "@/actions/collection/getSingleCollectionName";
import { getUserInfoAction } from "@/actions/user/getUserInfo";
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
import { ClientStateManager } from "@/components/Dashboard/Sidebar/client-state-manager";
import { redirect } from "next/navigation";

// Force dynamic rendering for authenticated routes
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Check if user has a username set
  const userInfo = await getUserInfoAction();

  if (userInfo && !userInfo.username) {
    redirect("/onboarding/username");
  }

  const searchParamsData = await searchParams;
  const activeItem = searchParamsData.item as string;
  const activeCollectionId = searchParamsData.collectionId as string;
  const activeSecondary = searchParamsData.secondary as string;

  let activeCollectionName = "";

  if (activeCollectionId) {
    const collectionNameResult =
      await getSingleCollectionNameAction(activeCollectionId);
    if (collectionNameResult.success) {
      activeCollectionName = collectionNameResult.data;
    } else {
      console.error(
        "Failed to fetch collection name:",
        collectionNameResult.error
      );
      // Handle error gracefully - redirect to dashboard without collection
      redirect("/dashboard");
    }
  }

  return (
    <SidebarProvider>
      <ClientStateManager
        activeItem={activeItem}
        activeCollectionId={activeCollectionId}
        activeSecondary={activeSecondary}
        activeCollectionName={activeCollectionName}
      />
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
          {activeCollectionId && (
            <NavActions activeCollectionId={activeCollectionId} />
          )}
        </header>
        <ContentArea />
      </SidebarInset>
    </SidebarProvider>
  );
}
