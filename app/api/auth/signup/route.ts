// app/api/auth/signup/route.ts — User registration endpoint

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import WalletModel from '@/models/Wallet';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    await connectDB();

    // Check for existing account
    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user (password is hashed by the model's pre-save hook)
    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password,
      provider: 'credentials',
    });

    // Create demo wallet with ₹10,00,000 starting balance
    await WalletModel.create({
      userId: user._id,
      inrBalance: 1_000_000,
      holdings: [],
    });

    return NextResponse.json(
      { success: true, message: 'Account created! Please sign in.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
