// models/Watchlist.ts — MongoDB Watchlist schema

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWatchlistItem extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  coinName: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlistItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true },
  coinName: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const WatchlistModel: Model<IWatchlistItem> =
  mongoose.models.Watchlist ||
  mongoose.model<IWatchlistItem>('Watchlist', WatchlistSchema);

// ── Alert model ────────────────────────────────────────────────────────
export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  coinName: string;
  condition: 'above' | 'below';
  targetPrice: number;
  isActive: boolean;
  triggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    symbol: { type: String, required: true, uppercase: true },
    coinName: { type: String, required: true },
    condition: { type: String, enum: ['above', 'below'], required: true },
    targetPrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    triggered: { type: Boolean, default: false },
    triggeredAt: { type: Date },
  },
  { timestamps: true }
);

export const AlertModel: Model<IAlert> =
  mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
