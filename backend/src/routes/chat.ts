import express, { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getAllMessages, addMessage } from '../services/chatService';
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from '../services/userService';

const router = express.Router();

// Get all chat messages
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const messages = getAllMessages();
    const recent = messages.slice(Math.max(0, messages.length - limit));
    res.json(recent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Save a message
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const user = getUserById(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const chat = {
      id: uuidv4(),
      userId: req.userId!,
      username: user.username,
      message,
      createdAt: new Date().toISOString(),
    };

    addMessage(chat);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;