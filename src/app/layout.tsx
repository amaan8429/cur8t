import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Bukmarks",
  description: "a way to share links faster and optmize your workflow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="px-3 pt-1">
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
