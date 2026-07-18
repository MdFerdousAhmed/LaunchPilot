import { Schema, model, Types } from 'mongoose';

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, default: '' },
  targetAudience: { type: String, default: '' },
  launchDate: { type: Date },
  launchReadinessScore: { type: Number, default: 0 },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

export const Project = model('Project', projectSchema);
