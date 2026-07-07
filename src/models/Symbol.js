import mongoose from 'mongoose';

const SymbolSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['stock', 'crypto', 'forex', 'commodity', 'currency'],
      required: true
    },
    market: {
      type: String,
      trim: true
    },
    currentPrice: {
      type: Number,
      default: 0
    },
    priceChange: {
      type: Number,
      default: 0
    },
    priceChangePercent: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Symbol', SymbolSchema);
