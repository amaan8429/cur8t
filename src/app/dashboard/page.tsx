import { AppSidebar } from "@/components/app-sidebar";
import { ContentArea } from "@/components/content-area";
import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const activeItem = searchParams.item as string;
  const activeList = searchParams.list as string;
  const activeSecondary = searchParams.secondary as string;

  return (
    <SidebarProvider>
      <AppSidebar
        activeItem={activeItem}
        activeList={activeList}
        activeSecondary={activeSecondary}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {activeItem || activeList || activeSecondary}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <ContentArea
          activeItem={activeItem}
          activeFavorite={activeList}
          activeSecondary={activeSecondary}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
