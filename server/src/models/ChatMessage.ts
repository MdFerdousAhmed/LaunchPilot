import { Schema, model } from 'mongoose';

const chatMessageSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  actionType: {
    type: String,
    enum: ['GENERATE_TASKS', 'GENERATE_LANDING_PAGE', 'GENERATE_PITCH_DECK', 'ANALYZE_COMPETITOR', 'GENERATE_CONTENT', 'NONE'],
    default: 'NONE'
  },
  actionData: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export const ChatMessage = model('ChatMessage', chatMessageSchema);
