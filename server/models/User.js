import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  spinsRemaining: {
    type: Number,
    default: 10
  },
  lastSpinTime: {
    type: Date,
    default: Date.now
  },
  wallet: {
    USDT: { type: Number, default: 0 },
    BTC: { type: Number, default: 0 },
    ETH: { type: Number, default: 0 },
    SOL: { type: Number, default: 0 },
    BNB: { type: Number, default: 0 },
    TON: { type: Number, default: 0 },
    DOGE: { type: Number, default: 0 }
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);