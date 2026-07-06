import { Server as SocketIOServer, Socket } from 'socket.io';
import { addMessage } from '../services/chatService';
import { getUserById } from '../services/userService';
import { v4 as uuidv4 } from 'uuid';

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    console.log('New user connected:', socket.id);

    // Handle chat messages
    socket.on('send-message', async (data: { userId: string; username: string; message: string }) => {
      try {
        // Save message to file
        const chat = {
          id: uuidv4(),
          userId: data.userId,
          username: data.username,
          message: data.message,
          createdAt: new Date().toISOString(),
        };

        addMessage(chat);

        // Broadcast to all connected users
        io.emit('receive-message', chat);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle user typing
    socket.on('typing', (data: { username: string }) => {
      socket.broadcast.emit('typing', data);
    });

    socket.on('stop-typing', () => {
      socket.broadcast.emit('stop-typing');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      io.emit('user-left', { socketId: socket.id });
    });
  });
};