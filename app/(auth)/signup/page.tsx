// app/(auth)/signup/page.tsx — Registration page

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? <CheckCircle2 size={12} className="text-[#00D4A0]" /> : <Circle size={12} className="text-[#5C6882]" />}
      <span className={met ? 'text-[#00D4A0]' : 'text-[#5C6882]'}>{label}</span>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const pw = form.password;
  const rules = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    match: pw === form.confirm && pw.length > 0,
  };
  const pwValid = Object.values(rules).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !pw) { toast.error('Please fill all fields'); return; }
    if (!pwValid) { toast.error('Please satisfy all password requirements'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: pw }),
      });
      const data = await res.json();

      if (!data.success) { toast.error(data.error); setLoading(false); return; }

      toast.success('Account created! Signing you in…');

      // Auto sign-in
      const signInRes = await signIn('credentials', {
        email: form.email,
        password: pw,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0B0E] px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,160,0.06) 0%, #0A0B0E 60%)' }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #00D4A0, #4F8EF7)' }}>
            <span className="text-2xl font-bold text-[#0A0B0E]">R</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-[#9BA5BF] mt-1 text-sm">Start trading with ₹10,00,000 demo balance</p>
        </div>

        <div className="bg-[#1E2433] border border-[#2A3348] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5C6882] uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aryan Kumar" autoComplete="name"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                  bg-[#111318] border border-[#2A3348] text-[#E8EBF2] placeholder-[#5C6882]
                  focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7]/20" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C6882] uppercase tracking-wider mb-2">Email address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                  bg-[#111318] border border-[#2A3348] text-[#E8EBF2] placeholder-[#5C6882]
                  focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7]/20" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C6882] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all
                    bg-[#111318] border border-[#2A3348] text-[#E8EBF2] placeholder-[#5C6882]
                    focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7]/20" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6882] hover:text-[#9BA5BF] p-1">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {pw.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 pl-1">
                  <PasswordRule met={rules.length} label="8+ characters" />
                  <PasswordRule met={rules.upper} label="Uppercase letter" />
                  <PasswordRule met={rules.number} label="Number" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C6882] uppercase tracking-wider mb-2">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat password"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                  bg-[#111318] border text-[#E8EBF2] placeholder-[#5C6882]
                  focus:ring-1 focus:ring-[#4F8EF7]/20
                  ${form.confirm.length > 0 ? (rules.match ? 'border-[#00D4A0]' : 'border-[#FF4757]') : 'border-[#2A3348] focus:border-[#4F8EF7]'}`} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #00A87D, #00D4A0)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account — It\'s Free'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#2A3348]" />
            <span className="text-xs text-[#5C6882]">or</span>
            <div className="flex-1 h-px bg-[#2A3348]" />
          </div>

          <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
              bg-[#111318] border border-[#2A3348] text-sm font-medium text-[#E8EBF2]
              hover:border-[#3A4660] hover:bg-[#161A22] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-[#5C6882] mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#4F8EF7] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
