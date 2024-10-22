import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import Announcement from '../models/Announcement.js';

const router = express.Router();

// Get all announcements
router.get('/announcements', adminAuth, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort('-createdAt');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

// Create announcement
router.post('/announcements', adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const announcement = new Announcement({ title, content });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement' });
  }
});

// Delete announcement
router.delete('/announcements/:id', adminAuth, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement' });
  }
});

export default router;