import express, { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Chat } from '../models/Chat';

const router = express.Router();

// Get all chat messages
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const messages = await Chat.find().sort({ createdAt: -1 }).limit(limit);
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Save a message (typically done via Socket.io, but here for API)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const user = await (await import('../models/User')).User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const chat = new Chat({
      userId: req.userId,
      username: user.username,
      message,
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;