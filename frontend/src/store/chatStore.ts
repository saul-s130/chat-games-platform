import { create } from 'zustand';

interface Message {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  typingUsers: string[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  addTypingUser: (username: string) => void;
  removeTypingUser: (username: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  typingUsers: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  addTypingUser: (username) =>
    set((state) => ({
      typingUsers: [...new Set([...state.typingUsers, username])],
    })),
  removeTypingUser: (username) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u !== username),
    })),
}));