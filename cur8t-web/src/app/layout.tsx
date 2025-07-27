import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Cur8t",
  description: "a way to share links faster and optmize your workflow",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable}`}>
          <ThemeProvider attribute="class" defaultTheme="system">
            <QueryProvider>
              <main>{children}</main>
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
