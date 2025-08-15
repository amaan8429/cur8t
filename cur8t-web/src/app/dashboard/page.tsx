import { getSingleCollectionNameAction } from '@/actions/collection/getSingleCollectionName';
import { getUserInfoAction } from '@/actions/user/getUserInfo';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';
import { NavActions } from '../../components/dashboard/NavActions/NavActions';
import { ClientStateManager } from '../../components/dashboard/Sidebar/ClientStateManager';
import { AppSidebar } from '../../components/dashboard/Sidebar/AppSidebar';
import { ContentArea } from '../../components/dashboard/ContentArea/ContentArea';

// Force dynamic rendering for authenticated routes
export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Check if user has a username set
  const userInfo = await getUserInfoAction();

  // Check for rate limiting on getUserInfoAction
  if (userInfo && 'error' in userInfo && 'retryAfter' in userInfo) {
    console.error(
      'Rate limited while fetching user info:',
      userInfo.error,
      'Retry after:',
      userInfo.retryAfter
    );
    // For rate limiting, redirect to a generic dashboard page
    redirect('/dashboard');
  }

  if (userInfo && 'username' in userInfo && !userInfo.username) {
    redirect('/onboarding/username');
  }

  const searchParamsData = await searchParams;
  const activeItem = searchParamsData.item as string;
  const activeCollectionId = searchParamsData.collectionId as string;
  const activeSecondary = searchParamsData.secondary as string;

  let activeCollectionName = '';

  if (activeCollectionId) {
    const collectionNameResult =
      await getSingleCollectionNameAction(activeCollectionId);

    // Check for rate limiting
    if (collectionNameResult.error && collectionNameResult.retryAfter) {
      console.error(
        'Rate limited while fetching collection name:',
        collectionNameResult.error,
        'Retry after:',
        collectionNameResult.retryAfter
      );
      // Handle rate limiting gracefully - redirect to dashboard without collection
      redirect('/dashboard');
    }

    if (collectionNameResult.success) {
      activeCollectionName = collectionNameResult.data;
    } else {
      console.error(
        'Failed to fetch collection name:',
        collectionNameResult.error
      );
      // Handle error gracefully - redirect to dashboard without collection
      redirect('/dashboard');
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
        <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:px-3">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbLink>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 text-sm sm:text-base">
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
