import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";
import { Oxanium, Merriweather, Fira_Code } from "next/font/google";

export const metadata = {
  title: "Cur8t",
  description: "a way to share links faster and optmize your workflow",
};

const oxanium = Oxanium({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
          className={`${oxanium.variable} ${merriweather.variable} ${firaCode.variable} theme font-sans`}
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
