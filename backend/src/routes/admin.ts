import express, { Response } from 'express';
import { AuthRequest, requireAdmin } from '../middleware/auth';
import { getAllUsers, updateUser } from '../services/userService';
import { getAllMessages } from '../services/chatService';
import { getAllAnnouncements, addAnnouncement } from '../services/announcementService';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all chat messages (admin only)
router.get('/chat/all', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const messages = getAllMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Ban user (admin only)
router.post('/users/:userId/ban', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;
    const user = updateUser(req.params.userId, { isBanned: true, bannedReason: reason });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User banned', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// Unban user (admin only)
router.post('/users/:userId/unban', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = updateUser(req.params.userId, { isBanned: false, bannedReason: undefined });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
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
    const user = updateUser(req.params.userId, { role: role as any });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
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
    const announcement = {
      id: uuidv4(),
      title,
      content,
      createdBy: req.userId!,
      createdAt: new Date().toISOString(),
    };
    addAnnouncement(announcement);
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Get all announcements
router.get('/announcements', async (req: AuthRequest, res: Response) => {
  try {
    const announcements = getAllAnnouncements().reverse();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

export default router;