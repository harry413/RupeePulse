// app/api/user/route.ts — Get and update user profile

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';

const updateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  currency: z.string().optional(),
});

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const userId = (session.user as any).id;
  const user = await UserModel.findById(userId).select('-password').lean();

  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: user });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  await connectDB();
  const userId = (session.user as any).id;

  await UserModel.findByIdAndUpdate(userId, { $set: parsed.data });

  return NextResponse.json({ success: true, message: 'Profile updated successfully' });
}
