import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  userId: string;
  username: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>('Chat', chatSchema);