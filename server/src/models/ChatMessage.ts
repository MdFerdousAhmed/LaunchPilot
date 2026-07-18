import { Schema, model } from 'mongoose';

const chatMessageSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ChatMessage = model('ChatMessage', chatMessageSchema);
