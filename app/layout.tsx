import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './(public)/globals.css';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Company Name', // Update title
  description: 'Company Description', // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Company Name',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: '/logo.png', // Or absolute URL
    sameAs: ['https://linkedin.com/company/...', 'https://twitter.com/...'],
  };

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white font-sans flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
