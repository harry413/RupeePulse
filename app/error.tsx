// app/error.tsx — Global error boundary

'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0B0E] px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-[#E8EBF2] mb-2">Something went wrong</h1>
        <p className="text-sm text-[#9BA5BF] mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2D6FD9, #4F8EF7)' }}
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#9BA5BF] border border-[#2A3348] hover:border-[#3A4660] hover:text-[#E8EBF2] transition-all"
          >
            Go Home
          </a>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-[#5C6882] font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
