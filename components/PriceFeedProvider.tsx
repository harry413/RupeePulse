// components/PriceFeedProvider.tsx — Mounts the WebSocket feed at app root

'use client';

import { useEffect } from 'react';
import { usePriceFeed } from '@/hooks/usePriceFeed';

export function PriceFeedProvider({ children }: { children: React.ReactNode }) {
  // This hook starts the WS / mock feed for the entire app lifetime
  usePriceFeed();
  return <>{children}</>;
}
