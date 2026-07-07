import mongoose from 'mongoose';

const WatchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    symbols: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Symbol'
      }
    ],
    order: {
      type: Number,
      default: 0
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Create unique index for user's watchlist names
WatchlistSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Watchlist', WatchlistSchema);
