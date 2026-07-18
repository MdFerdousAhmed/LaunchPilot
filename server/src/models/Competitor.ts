import { Schema, model } from 'mongoose';

const competitorSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, default: '' },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  features: { type: [String], default: [] },
  price: { type: String, default: '' },
  notes: { type: String, default: '' },
  score: { type: Number, default: 5 }, // 1 to 10 scale
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

export const Competitor = model('Competitor', competitorSchema);
