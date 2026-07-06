import { Server as SocketIOServer, Socket } from 'socket.io';
import { Chat } from '../models/Chat';
import { User } from '../models/User';

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    console.log('New user connected:', socket.id);

    // Join a user to a room (for future game features)
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { socketId: socket.id });
    });

    // Handle chat messages
    socket.on('send-message', async (data: { userId: string; username: string; message: string }) => {
      try {
        // Save message to database
        const chat = new Chat({
          userId: data.userId,
          username: data.username,
          message: data.message,
        });
        await chat.save();

        // Broadcast to all connected users
        io.emit('receive-message', {
          id: chat._id,
          userId: data.userId,
          username: data.username,
          message: data.message,
          createdAt: chat.createdAt,
        });
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