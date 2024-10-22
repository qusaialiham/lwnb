import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user spin data
router.get('/spins', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();
    let nextSpinTime = null;

    if (user.spinsRemaining < 10) {
      const timeSinceLastSpin = now - user.lastSpinTime;
      const hoursElapsed = timeSinceLastSpin / (1000 * 60 * 60);
      
      if (hoursElapsed >= 1) {
        const spinsToAdd = Math.min(Math.floor(hoursElapsed), 10 - user.spinsRemaining);
        user.spinsRemaining += spinsToAdd;
        user.lastSpinTime = now;
        await user.save();
      }

      if (user.spinsRemaining < 10) {
        nextSpinTime = new Date(user.lastSpinTime.getTime() + (60 * 60 * 1000));
      }
    }

    res.json({
      spinsRemaining: user.spinsRemaining,
      nextSpinTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching spin data' });
  }
});

// Spin the wheel
router.post('/spin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.spinsRemaining <= 0) {
      return res.status(400).json({ message: 'No spins remaining' });
    }

    // Prize probabilities (total 100)
    const prizes = [
      { name: 'USDT', probability: 30 }, // 30%
      { name: 'DOGE', probability: 25 }, // 25%
      { name: 'TON', probability: 20 },  // 20%
      { name: 'BNB', probability: 10 },  // 10%
      { name: 'SOL', probability: 8 },   // 8%
      { name: 'ETH', probability: 5 },   // 5%
      { name: 'BTC', probability: 2 }    // 2%
    ];

    // Generate random number between 0 and 100
    const random = Math.random() * 100;
    let sum = 0;
    let prize = prizes[0].name;

    // Select prize based on probability
    for (const p of prizes) {
      sum += p.probability;
      if (random <= sum) {
        prize = p.name;
        break;
      }
    }

    // Award prize
    user.wallet[prize] += 0.0001; // Small amount for demonstration
    user.spinsRemaining -= 1;
    user.lastSpinTime = new Date();
    await user.save();

    const nextSpinTime = user.spinsRemaining < 10 
      ? new Date(user.lastSpinTime.getTime() + (60 * 60 * 1000))
      : null;

    res.json({
      prize,
      spinsRemaining: user.spinsRemaining,
      nextSpinTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing spin' });
  }
});

// Get user wallet
router.get('/wallet', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet' });
  }
});

export default router;