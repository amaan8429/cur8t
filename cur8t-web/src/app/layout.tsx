import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { Oxanium, Merriweather, Fira_Code } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'Cur8t - Share Links Faster & Optimize Your Workflow',
  description:
    'A modern platform to share links faster and optimize your workflow with intelligent bookmark management and collaboration tools.',
  keywords: [
    'bookmarks',
    'link sharing',
    'workflow optimization',
    'productivity',
    'collaboration',
  ],
  authors: [{ name: 'Cur8t Team' }],
  creator: 'Cur8t',
  publisher: 'Cur8t',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cur8t.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cur8t.com',
    siteName: 'Cur8t',
    title: 'Cur8t - Share Links Faster & Optimize Your Workflow',
    description:
      'A modern platform to share links faster and optimize your workflow with intelligent bookmark management and collaboration tools.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cur8t - Share Links Faster & Optimize Your Workflow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cur8t',
    creator: '@cur8t',
    title: 'Cur8t - Share Links Faster & Optimize Your Workflow',
    description:
      'A modern platform to share links faster and optimize your workflow with intelligent bookmark management and collaboration tools.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const oxanium = Oxanium({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const merriweather = Merriweather({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

const firaCode = Fira_Code({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
          <ThemeProvider attribute="class" defaultTheme="light">
            <QueryProvider>
              <ErrorBoundary>
                <main>
                  {children}
                  <Analytics />
                </main>
                <Toaster />
              </ErrorBoundary>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
