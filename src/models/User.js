import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[0-9]{10,15}$/
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    subscription: {
      type: {
        enum: ['single', 'multi'],
        default: 'single'
      },
      duration: {
        enum: ['1day', '1week', '1month'],
        default: '1month'
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: true
      },
      maxDevices: {
        type: Number,
        default: 1
      }
    },
    lastLogin: {
      type: Date,
      default: null
    },
    activeSessions: [{
      deviceId: String,
      deviceName: String,
      loginTime: Date,
      lastActivityTime: Date
    }],
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Generate referral code before saving
UserSchema.pre('save', async function (next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  next();
});

export default mongoose.model('User', UserSchema);
