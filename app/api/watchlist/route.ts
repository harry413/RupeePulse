// app/api/watchlist/route.ts — Get, add, remove watchlist items

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { WatchlistModel } from '@/models/Watchlist';

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const userId = (session.user as any).id;
  const items = await WatchlistModel.find({ userId }).sort({ addedAt: -1 }).lean();
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { symbol, coinName } = await req.json();
  if (!symbol) return NextResponse.json({ success: false, error: 'Symbol required' }, { status: 400 });

  await connectDB();
  const userId = (session.user as any).id;

  await WatchlistModel.findOneAndUpdate(
    { userId, symbol: symbol.toUpperCase() },
    { userId, symbol: symbol.toUpperCase(), coinName, addedAt: new Date() },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, message: `${symbol} added to watchlist` });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  if (!symbol) return NextResponse.json({ success: false, error: 'Symbol required' }, { status: 400 });

  await connectDB();
  const userId = (session.user as any).id;
  await WatchlistModel.findOneAndDelete({ userId, symbol: symbol.toUpperCase() });
  return NextResponse.json({ success: true, message: `${symbol} removed from watchlist` });
}
