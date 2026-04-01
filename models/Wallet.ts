// models/Wallet.ts — MongoDB Wallet schema

import mongoose, { Schema, Document, Model } from 'mongoose';

interface IHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number; // In INR
  totalInvested: number;
}

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  inrBalance: number; // Cash in INR
  holdings: IHolding[];
  updatedAt: Date;
}

const HoldingSchema = new Schema<IHolding>(
  {
    symbol: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    avgBuyPrice: { type: Number, required: true, min: 0 },
    totalInvested: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const WalletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    inrBalance: { type: Number, required: true, default: 1_000_000 }, // ₹10 lakh demo
    holdings: [HoldingSchema],
  },
  { timestamps: true }
);

const WalletModel: Model<IWallet> =
  mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);

export default WalletModel;
