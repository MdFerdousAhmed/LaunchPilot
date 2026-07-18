import { Schema, model } from 'mongoose';

const landingPageSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  htmlCode: { type: String, required: true },
  cssCode: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const LandingPage = model('LandingPage', landingPageSchema);
