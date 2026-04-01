// app/api/alerts/route.ts — Price alert CRUD

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { AlertModel } from '@/models/Watchlist';

const alertSchema = z.object({
  symbol: z.string().min(1).max(10).toUpperCase(),
  coinName: z.string(),
  condition: z.enum(['above', 'below']),
  targetPrice: z.number().positive(),
});

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const userId = (session.user as any).id;
  const alerts = await AlertModel.find({ userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: alerts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });

  await connectDB();
  const userId = (session.user as any).id;
  const alert = await AlertModel.create({ userId, ...parsed.data });
  return NextResponse.json({ success: true, data: alert }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { id, isActive } = await req.json();
  await connectDB();
  await AlertModel.findByIdAndUpdate(id, { isActive });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectDB();
  await AlertModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
