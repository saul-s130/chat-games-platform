import express, { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getAllUsers, getUserById, updateUser } from '../services/userService';

const router = express.Router();

// Get all users
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const users = getAllUsers().map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get current user
router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const user = getUserById(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/me', async (req: AuthRequest, res: Response) => {
  try {
    const { username, email } = req.body;
    const user = updateUser(req.userId!, { username, email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;