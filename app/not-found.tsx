// app/not-found.tsx — Custom 404 page

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0A0B0E] px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(79,142,247,0.06) 0%, #0A0B0E 60%)' }}
    >
      <div className="text-center max-w-md">
        {/* Logo */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-[#0A0B0E] mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #00D4A0, #4F8EF7)' }}
        >
          R
        </div>

        {/* Error code */}
        <div className="text-8xl font-bold font-mono mb-2" style={{
          background: 'linear-gradient(135deg, #4F8EF7, #A78BFA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          404
        </div>

        <h1 className="text-xl font-bold text-[#E8EBF2] mb-2">Page not found</h1>
        <p className="text-sm text-[#9BA5BF] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2D6FD9, #4F8EF7)' }}
          >
            Go to Dashboard
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#9BA5BF] border border-[#2A3348] hover:border-[#3A4660] hover:text-[#E8EBF2] transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
