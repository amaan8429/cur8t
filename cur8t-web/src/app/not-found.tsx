import { NotFoundErrorPage } from '@/components/ui/error-page';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <NotFoundErrorPage
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        errorCode="404"
      />
    </div>
  );
}
