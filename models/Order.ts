// models/Order.ts — MongoDB Order/Transaction schema

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  coinName: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop-loss';
  quantity: number;
  price: number;
  limitPrice?: number;
  total: number;
  fee: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  filledAt?: Date;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symbol: { type: String, required: true, uppercase: true },
    coinName: { type: String, required: true },
    side: { type: String, enum: ['buy', 'sell'], required: true },
    type: {
      type: String,
      enum: ['market', 'limit', 'stop-loss'],
      default: 'market',
    },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    limitPrice: { type: Number },
    total: { type: Number, required: true, min: 0 },
    fee: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'filled', 'cancelled', 'rejected'],
      default: 'pending',
    },
    filledAt: { type: Date },
  },
  { timestamps: true }
);

// Index for fast user order history queries
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ userId: 1, symbol: 1 });

const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;
