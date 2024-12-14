import { AppSidebar } from "@/components/app-sidebar";
import { ContentArea } from "@/components/content-area";
import { NavActions } from "@/components/nav-actions";
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsData = await searchParams;
  const activeItem = searchParamsData.item as string;
  const activeCollectionId = searchParamsData.collectionId as string;
  const activeSecondary = searchParamsData.secondary as string;

  return (
    <SidebarProvider>
      <AppSidebar
        activeItem={activeItem}
        activeCollectionId={activeCollectionId}
        activeSecondary={activeSecondary}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbLink>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {activeItem || activeCollectionId || activeSecondary}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbLink>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <ContentArea
          activeItem={activeItem}
          activeCollectionId={activeCollectionId}
          activeSecondary={activeSecondary}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
