// app/layout.tsx — Root layout with Providers

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'RupeePulse', template: '%s | RupeePulse' },
  description: 'Real-time crypto trading platform for Indian investors. Buy, sell and track Bitcoin, Ethereum and 50+ coins in INR.',
  keywords: ['crypto', 'trading', 'bitcoin', 'ethereum', 'INR', 'India', 'cryptocurrency'],
  authors: [{ name: 'RupeePulse' }],
  creator: 'RupeePulse',
  themeColor: '#0A0B0E',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'RupeePulse — Crypto Trading in INR',
    description: 'Trade Bitcoin, Ethereum & 50+ coins in real-time. Built for Indian investors.',
    siteName: 'RupeePulse',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
