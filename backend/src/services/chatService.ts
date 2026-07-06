import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../../data');

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
}

const chatFile = path.join(dataDir, 'chat.json');

function ensureChatFile() {
  if (!fs.existsSync(chatFile)) {
    fs.writeFileSync(chatFile, JSON.stringify([], null, 2));
  }
}

export function getAllMessages(): ChatMessage[] {
  ensureChatFile();
  const data = fs.readFileSync(chatFile, 'utf-8');
  return JSON.parse(data);
}

export function addMessage(message: ChatMessage): ChatMessage {
  const messages = getAllMessages();
  messages.push(message);
  fs.writeFileSync(chatFile, JSON.stringify(messages, null, 2));
  return message;
}

export function getRecentMessages(limit: number = 50): ChatMessage[] {
  const messages = getAllMessages();
  return messages.slice(Math.max(0, messages.length - limit));
}