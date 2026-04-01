// lib/auth.ts — NextAuth configuration
// Supports Email/Password (credentials) + Google OAuth

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import UserModel from '@/models/User';
import WalletModel from '@/models/Wallet';

export const authOptions: NextAuthOptions = {
  // Use JWT sessions (no database adapter needed for sessions)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    // ── Google OAuth ─────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // ── Email / Password ──────────────────────────────────
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectDB();

        // Find user in database
        const user = await UserModel.findOne({
          email: credentials.email.toLowerCase(),
        }).select('+password');

        if (!user) {
          throw new Error('No account found with this email');
        }

        if (!user.password) {
          throw new Error('Please sign in with Google');
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // ── Called after sign in (Google or credentials) ──────
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB();

        // Upsert Google user — create if new, update if returning
        const existing = await UserModel.findOne({ email: user.email });
        if (!existing) {
          const newUser = await UserModel.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google',
          });

          // Create starting wallet with ₹10,00,000 demo balance
          await WalletModel.create({
            userId: newUser._id,
            inrBalance: 1_000_000, // ₹10 lakh demo balance
            holdings: [],
          });
        }
      }
      return true;
    },

    // ── Enrich JWT token with user ID ─────────────────────
    async jwt({ token, user, account }) {
      if (user) {
        await connectDB();
        const dbUser = await UserModel.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.provider = dbUser.provider;
        }
      }
      return token;
    },

    // ── Expose user ID in session ─────────────────────────
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },

  events: {
    // Clean up failed sign-in attempts (optional logging)
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
