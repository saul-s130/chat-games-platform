import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../../data');

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'premium' | 'vip' | 'admin';
  isBanned: boolean;
  bannedReason?: string;
  createdAt: string;
}

const usersFile = path.join(dataDir, 'users.json');

function ensureUsersFile() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  }
}

export function getAllUsers(): User[] {
  ensureUsersFile();
  const data = fs.readFileSync(usersFile, 'utf-8');
  return JSON.parse(data);
}

export function getUserById(id: string): User | undefined {
  return getAllUsers().find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getAllUsers().find(u => u.email === email);
}

export function getUserByUsername(username: string): User | undefined {
  return getAllUsers().find(u => u.username === username);
}

export function createUser(user: User): User {
  const users = getAllUsers();
  users.push(user);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return undefined;
  
  users[index] = { ...users[index], ...updates };
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getAllUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  
  fs.writeFileSync(usersFile, JSON.stringify(filtered, null, 2));
  return true;
}