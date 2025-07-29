import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";
import {
  Inter,
  Poppins,
  Libre_Baskerville,
  IBM_Plex_Mono,
} from "next/font/google";

export const metadata = {
  title: "Cur8t",
  description: "a way to share links faster and optmize your workflow",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${poppins.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable} theme font-sans`}
        >
          <ThemeProvider attribute="class" defaultTheme="system">
            <QueryProvider>
              <ErrorBoundary>
                <main>{children}</main>
                <Toaster />
              </ErrorBoundary>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
