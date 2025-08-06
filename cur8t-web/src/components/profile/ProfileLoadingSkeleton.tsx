import { ProfileHeader } from './ProfileHeader';

export function ProfileLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse">
          <div className="flex gap-6">
            <div className="w-72 space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-40"></div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[120px] bg-muted rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
