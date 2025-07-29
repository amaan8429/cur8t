import Link from "next/link";

export function ProfileHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Cur8t
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            href="/add-extension"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Add Extension
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
