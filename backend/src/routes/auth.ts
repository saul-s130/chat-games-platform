import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, getUserByUsername, createUser } from '../services/userService';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      if (getUserByEmail(email)) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (getUserByUsername(username)) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = {
        id: uuidv4(),
        username,
        email,
        password: hashedPassword,
        role: 'user' as const,
        isBanned: false,
        createdAt: new Date().toISOString(),
      };

      createUser(user);

      // Generate token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Check if banned
      if (user.isBanned) {
        return res.status(403).json({ error: `You have been banned. Reason: ${user.bannedReason}` });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

export default router;