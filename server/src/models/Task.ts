import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Development', 'Marketing', 'Legal', 'Product', 'Launch', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Todo', 'InProgress', 'Done'],
    default: 'Todo'
  },
  dueDate: { type: Date },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

export const Task = model('Task', taskSchema);
