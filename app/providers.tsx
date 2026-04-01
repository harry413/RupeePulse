// app/providers.tsx — Client-side providers wrapper

'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { PriceFeedProvider } from '@/components/PriceFeedProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PriceFeedProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1E2433',
              color: '#E8EBF2',
              border: '1px solid #2A3348',
              borderRadius: '10px',
              fontSize: '13px',
              fontFamily: 'Space Grotesk, sans-serif',
            },
            success: {
              iconTheme: { primary: '#00D4A0', secondary: '#0A0B0E' },
            },
            error: {
              iconTheme: { primary: '#FF4757', secondary: '#fff' },
            },
            duration: 4000,
          }}
        />
      </PriceFeedProvider>
    </SessionProvider>
  );
}
