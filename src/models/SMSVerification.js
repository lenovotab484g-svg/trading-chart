import mongoose from 'mongoose';

const SMSVerificationSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      index: { expires: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Auto delete expired documents
SMSVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('SMSVerification', SMSVerificationSchema);
