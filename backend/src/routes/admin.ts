import express, { Response } from 'express';
import { AuthRequest, requireAdmin } from '../middleware/auth';
import { User } from '../models/User';
import { Chat } from '../models/Chat';
import { Announcement } from '../models/Announcement';

const router = express.Router();

// Get all chat messages (admin only)
router.get('/chat/all', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Chat.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Ban user (admin only)
router.post('/users/:userId/ban', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned: true, bannedReason: reason },
      { new: true }
    );
    res.json({ message: 'User banned', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// Unban user (admin only)
router.post('/users/:userId/unban', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned: false, bannedReason: undefined },
      { new: true }
    );
    res.json({ message: 'User unbanned', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

// Update user role (admin only)
router.put('/users/:userId/role', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!['user', 'premium', 'vip', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Post announcement (admin only)
router.post('/announcements', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const announcement = new Announcement({
      title,
      content,
      createdBy: req.userId,
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Get all announcements
router.get('/announcements', async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

export default router;