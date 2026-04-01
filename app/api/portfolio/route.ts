// app/api/portfolio/route.ts — Portfolio value and holdings

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import WalletModel from '@/models/Wallet';
import { getMarketPrices } from '@/lib/coingecko';
import { INITIAL_PRICES } from '@/hooks/usePriceFeed';

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = (session.user as any).id;

    const wallet = await WalletModel.findOne({ userId }).lean();
    if (!wallet) {
      return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
    }

    // Get current prices
    let priceMap: Record<string, number> = { ...INITIAL_PRICES };
    try {
      const marketData = await getMarketPrices();
      marketData.forEach((c: any) => {
        priceMap[c.symbol] = c.current_price;
      });
    } catch {
      // Use defaults if CoinGecko unavailable
    }

    // Compute portfolio value with current prices
    let totalHoldingsValue = 0;
    let totalInvested = 0;

    const enrichedHoldings = (wallet.holdings as any[]).map((h) => {
      const currentPrice = priceMap[h.symbol] ?? h.avgBuyPrice;
      const currentValue = h.quantity * currentPrice;
      const pnl = currentValue - h.totalInvested;
      const pnlPct = h.totalInvested > 0 ? (pnl / h.totalInvested) * 100 : 0;

      totalHoldingsValue += currentValue;
      totalInvested += h.totalInvested;

      return {
        symbol: h.symbol,
        name: h.name,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice,
        currentValue,
        totalInvested: h.totalInvested,
        pnl,
        pnlPct,
      };
    });

    const totalValue = wallet.inrBalance + totalHoldingsValue;
    const totalPnL = totalHoldingsValue - totalInvested;
    const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        inrBalance: wallet.inrBalance,
        totalValue,
        totalHoldingsValue,
        totalInvested,
        totalPnL,
        totalPnLPct,
        dayChange: totalValue * 0.0234, // demo 24h change
        dayChangePct: 2.34,
        holdings: enrichedHoldings.sort((a, b) => b.currentValue - a.currentValue),
      },
    });
  } catch (error) {
    console.error('Portfolio error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}
