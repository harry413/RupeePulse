// scripts/seed.js — Seed MongoDB with demo user + wallet + orders
// Usage: node scripts/seed.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rupeepulse';

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  provider: { type: String, default: 'credentials' },
  isVerified: { type: Boolean, default: true },
}, { timestamps: true });

const WalletSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  inrBalance: { type: Number, default: 1_000_000 },
  holdings: [{
    symbol: String, name: String,
    quantity: Number, avgBuyPrice: Number, totalInvested: Number,
    _id: false,
  }],
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  symbol: String, coinName: String,
  side: String, type: { type: String, default: 'market' },
  quantity: Number, price: Number, total: Number,
  fee: Number, status: String, filledAt: Date,
}, { timestamps: true });

const WatchlistSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  symbol: String, coinName: String,
  addedAt: { type: Date, default: Date.now },
});

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB:', MONGODB_URI);

  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
  const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
  const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema);

  // Clear demo data
  const existingDemo = await User.findOne({ email: 'demo@rupeepulse.in' });
  if (existingDemo) {
    await Wallet.deleteMany({ userId: existingDemo._id });
    await Order.deleteMany({ userId: existingDemo._id });
    await Watchlist.deleteMany({ userId: existingDemo._id });
    await User.deleteOne({ _id: existingDemo._id });
    console.log('🧹 Cleared existing demo data');
  }

  // Create demo user
  const password = await bcrypt.hash('Demo@1234', 12);
  const user = await User.create({
    name: 'Aryan Kumar',
    email: 'demo@rupeepulse.in',
    password,
    provider: 'credentials',
    isVerified: true,
  });
  console.log('👤 Created demo user:', user.email);

  // Create wallet with demo holdings
  await Wallet.create({
    userId: user._id,
    inrBalance: 124_800,
    holdings: [
      { symbol: 'BTC',  name: 'Bitcoin',    quantity: 0.12,  avgBuyPrice: 7_800_000, totalInvested: 936_000  },
      { symbol: 'ETH',  name: 'Ethereum',   quantity: 2.5,   avgBuyPrice: 290_000,   totalInvested: 725_000  },
      { symbol: 'SOL',  name: 'Solana',     quantity: 12,    avgBuyPrice: 16_000,    totalInvested: 192_000  },
      { symbol: 'BNB',  name: 'BNB',        quantity: 3,     avgBuyPrice: 55_000,    totalInvested: 165_000  },
      { symbol: 'XRP',  name: 'XRP',        quantity: 500,   avgBuyPrice: 1_050,     totalInvested: 525_000  },
      { symbol: 'DOGE', name: 'Dogecoin',   quantity: 5000,  avgBuyPrice: 22,        totalInvested: 110_000  },
    ],
  });
  console.log('💰 Created wallet with demo holdings');

  // Seed order history
  const orders = [
    { symbol:'BTC',  coinName:'Bitcoin',   side:'buy',  quantity:0.003, price:8_420_000, total:25_260,   fee:25,  status:'filled' },
    { symbol:'ETH',  coinName:'Ethereum',  side:'sell', quantity:0.5,   price:3_100_000, total:155_000,  fee:155, status:'filled' },
    { symbol:'SOL',  coinName:'Solana',    side:'buy',  quantity:5,     price:17_200,    total:86_000,   fee:86,  status:'filled' },
    { symbol:'DOGE', coinName:'Dogecoin',  side:'buy',  quantity:2000,  price:24,        total:48_000,   fee:48,  status:'filled' },
    { symbol:'BNB',  coinName:'BNB',       side:'sell', quantity:1,     price:54_000,    total:54_000,   fee:54,  status:'filled' },
    { symbol:'XRP',  coinName:'XRP',       side:'buy',  quantity:200,   price:900,       total:180_000,  fee:180, status:'cancelled' },
    { symbol:'ADA',  coinName:'Cardano',   side:'buy',  quantity:500,   price:80,        total:40_000,   fee:40,  status:'filled' },
  ];

  for (const o of orders) {
    await Order.create({
      userId: user._id, ...o,
      type: 'market',
      filledAt: o.status === 'filled' ? new Date() : undefined,
    });
  }
  console.log(`📋 Created ${orders.length} demo orders`);

  // Seed watchlist
  const watchlist = ['BTC','ETH','SOL','BNB'].map(sym => ({
    userId: user._id, symbol: sym,
    coinName: { BTC:'Bitcoin', ETH:'Ethereum', SOL:'Solana', BNB:'BNB' }[sym],
  }));
  await Watchlist.insertMany(watchlist);
  console.log('⭐ Created watchlist');

  console.log('\n✨ Seed complete!');
  console.log('   Email:    demo@rupeepulse.in');
  console.log('   Password: Demo@1234\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
