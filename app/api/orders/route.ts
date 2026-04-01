// app/api/orders/route.ts — Place orders and fetch order history

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import OrderModel from '@/models/Order';
import WalletModel from '@/models/Wallet';

const FEE_RATE = 0.001; // 0.1%

// ── Validation schema ─────────────────────────────────────
const orderSchema = z.object({
  symbol: z.string().min(1).max(10).toUpperCase(),
  coinName: z.string().min(1).max(50),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit', 'stop-loss']).default('market'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  limitPrice: z.number().positive().optional(),
});

// ── POST /api/orders — Execute a trade ────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { symbol, coinName, side, type, quantity, price, limitPrice } = parsed.data;
    const userId = (session.user as any).id;
    const total = quantity * price;
    const fee = total * FEE_RATE;

    await connectDB();

    // Load user's wallet
    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
    }

    // ── Buy order ─────────────────────────────────────────
    if (side === 'buy') {
      const totalCost = total + fee;
      if (wallet.inrBalance < totalCost) {
        return NextResponse.json(
          { success: false, error: `Insufficient balance. Need ₹${totalCost.toFixed(2)}, have ₹${wallet.inrBalance.toFixed(2)}` },
          { status: 400 }
        );
      }

      // Deduct INR
      wallet.inrBalance -= totalCost;

      // Update holdings — average cost basis
      const existingIdx = wallet.holdings.findIndex((h: any) => h.symbol === symbol);
      if (existingIdx >= 0) {
        const existing = wallet.holdings[existingIdx];
        const newQty = existing.quantity + quantity;
        const newInvested = existing.totalInvested + total;
        wallet.holdings[existingIdx] = {
          symbol,
          name: coinName,
          quantity: newQty,
          avgBuyPrice: newInvested / newQty,
          totalInvested: newInvested,
        };
      } else {
        wallet.holdings.push({ symbol, name: coinName, quantity, avgBuyPrice: price, totalInvested: total });
      }
    }

    // ── Sell order ────────────────────────────────────────
    if (side === 'sell') {
      const holdingIdx = wallet.holdings.findIndex((h: any) => h.symbol === symbol);
      if (holdingIdx < 0 || wallet.holdings[holdingIdx].quantity < quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient ${symbol} balance` },
          { status: 400 }
        );
      }

      const holding = wallet.holdings[holdingIdx];
      holding.quantity -= quantity;
      holding.totalInvested = holding.quantity * holding.avgBuyPrice;

      if (holding.quantity < 0.00000001) {
        wallet.holdings.splice(holdingIdx, 1); // Remove dust
      }

      wallet.inrBalance += total - fee; // Add proceeds minus fee
    }

    wallet.markModified('holdings');
    await wallet.save();

    // Record the order
    const order = await OrderModel.create({
      userId,
      symbol,
      coinName,
      side,
      type,
      quantity,
      price,
      limitPrice,
      total,
      fee,
      status: 'filled',
      filledAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: `${side === 'buy' ? 'Bought' : 'Sold'} ${quantity} ${symbol} at ₹${price.toLocaleString('en-IN')}`,
      data: {
        orderId: order._id,
        symbol,
        side,
        quantity,
        price,
        total,
        fee,
        newBalance: wallet.inrBalance,
      },
    });
  } catch (error: any) {
    console.error('Order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute order. Please try again.' },
      { status: 500 }
    );
  }
}

// ── GET /api/orders — Fetch order history ─────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const symbol = searchParams.get('symbol');

    const userId = (session.user as any).id;
    await connectDB();

    const query: any = { userId };
    if (symbol) query.symbol = symbol.toUpperCase();

    const [orders, total] = await Promise.all([
      OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      OrderModel.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}
